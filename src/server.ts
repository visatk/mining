import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign, verify } from 'hono/jwt';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

type Variables = { user: { id: string; username: string } };
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

const hashPassword = async (password: string) => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const protect = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'auth_token');
  if (!token) return c.json({ success: false, error: 'Unauthorized' }, 401);
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback_secret');
    c.set('user', { id: payload.id as string, username: payload.username as string });
    await next();
  } catch (err) {
    deleteCookie(c, 'auth_token', { path: '/' });
    return c.json({ success: false, error: 'Session Expired' }, 401);
  }
});

// --- AUTH ROUTES ---
app.post('/api/auth/register', zValidator('json', z.object({ username: z.string().min(3), password: z.string().min(6) })), async (c) => {
  const { username, password } = c.req.valid('json');
  try {
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) return c.json({ success: false, error: 'Username taken' }, 400);

    const id = crypto.randomUUID();
    await c.env.DB.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(id, username, await hashPassword(password)).run();

    const token = await sign({ id, username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, c.env.JWT_SECRET || 'fallback_secret');
    setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
    return c.json({ success: true, user: { id, username, balance: 50.00 } });
  } catch (err: any) { return c.json({ success: false, error: err.message }, 500); }
});

app.post('/api/auth/login', zValidator('json', z.object({ username: z.string(), password: z.string() })), async (c) => {
  const { username, password } = c.req.valid('json');
  const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE username = ? AND password_hash = ?')
    .bind(username, await hashPassword(password)).first();

  if (!user) return c.json({ success: false, error: 'Invalid credentials' }, 401);
  const token = await sign({ id: user.id as string, username: user.username as string, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env.JWT_SECRET || 'fallback_secret');
  setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });
  return c.json({ success: true, user });
});

app.post('/api/auth/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  return c.json({ success: true });
});

app.get('/api/auth/me', protect, async (c) => {
  const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE id = ?').bind(c.get('user').id).first();
  return user ? c.json({ success: true, user }) : c.json({ success: false }, 401);
});

// --- SHOP & TRANSACTION ROUTES ---
app.get('/api/cards', protect, async (c) => {
  const bin = c.req.query('bin');
  const country = c.req.query('country');
  const limit = parseInt(c.req.query('limit') || '50', 10);
  const offset = (parseInt(c.req.query('page') || '1', 10) - 1) * limit;

  let baseQuery = `FROM bins WHERE SUBSTR(bin, 1, 1) IN ('3', '4', '5', '6')`;
  const params: string[] = [];

  if (bin) { baseQuery += ' AND bin LIKE ?'; params.push(`${bin}%`); }
  if (country) { baseQuery += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)'; params.push(`%${country}%`, `%${country}%`); }

  try {
    const total = await c.env.DB.prepare(`SELECT COUNT(*) as t ${baseQuery}`).bind(...params).first('t') as number || 0;
    const { results } = await c.env.DB.prepare(`SELECT * ${baseQuery} ORDER BY RANDOM() LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset).all();

    const BASES = ['APR#02_USA', 'MAY#01_MIX', 'JUN#12_UK', 'APR#15_CA'];
    const mapped = results.map((row: any) => ({
      id: row.id,
      bin: row.bin,
      type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
      exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
      country: row.iso_code_2 || 'US',
      stateCityZip: `${row.country_name || 'USA'} / - / -`,
      base: BASES[Math.floor(Math.random() * BASES.length)],
      price: (Math.random() * (15 - 8) + 8).toFixed(2), 
    }));

    return c.json({ success: true, data: mapped, pagination: { total, totalPages: Math.ceil(total / limit) } });
  } catch (err: any) { return c.json({ success: false, error: err.message }, 500); }
});

app.post('/api/buy', protect, zValidator('json', z.object({ card: z.any() })), async (c) => {
  const user = c.get('user');
  const { card } = c.req.valid('json');
  const price = parseFloat(card.price);
  const db = c.env.DB;

  // 1. Fetch current user balance
  const dbUser = await db.prepare('SELECT balance FROM users WHERE id = ?').bind(user.id).first<{ balance: number }>();
  if (!dbUser || dbUser.balance < price) {
    return c.json({ success: false, error: 'Insufficient funds' }, 400);
  }

  // Generate a mock full CC for the order history
  const fullCC = `${card.bin}${Math.floor(1000000000 + Math.random() * 9000000000)}|${card.exp.replace('/', '|')}|${Math.floor(100 + Math.random() * 899)}`;
  const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

  // 2. Perform Transaction (Deduct balance & Create order in batch)
  try {
    await db.batch([
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(price, user.id),
      db.prepare('INSERT INTO orders (id, user_id, item_reference, card_details, amount) VALUES (?, ?, ?, ?, ?)')
        .bind(orderId, user.id, `${card.bin} - ${card.base}`, fullCC, price)
    ]);
    return c.json({ success: true, newBalance: dbUser.balance - price });
  } catch (err: any) {
    return c.json({ success: false, error: 'Transaction failed' }, 500);
  }
});

app.get('/api/orders', protect, async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(c.get('user').id).all();
  return c.json({ success: true, orders: results });
});

export default app;
