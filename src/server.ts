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

// --- SELF-HEALING DATABASE ---
// Automatically creates tables if they don't exist so you never get a 500 error
const ensureDB = async (db: D1Database) => {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      balance REAL DEFAULT 50.00,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      item_reference TEXT NOT NULL,
      card_details TEXT NOT NULL,
      amount REAL NOT NULL,
      status TEXT DEFAULT 'COMPLETED',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE IF NOT EXISTS bins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      bin TEXT,
      brand TEXT,
      type TEXT,
      category TEXT,
      iso_code_2 TEXT,
      country_name TEXT
    );
  `);
};

// Crypto Hash Helper
const hashPassword = async (password: string) => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Cookie Setter Helper (fixes localhost vs HTTPS issues)
const setAuthCookie = (c: any, token: string) => {
  const isSecure = c.req.url.startsWith('https://');
  setCookie(c, 'auth_token', token, { 
    httpOnly: true, 
    secure: isSecure, // Dynamically allows HTTP in dev, enforces HTTPS in prod
    sameSite: 'Lax', 
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
};

// --- AUTH MIDDLEWARE ---
const protect = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'auth_token');
  if (!token) return c.json({ success: false, error: 'Unauthorized - Missing Cookie' }, 401);
  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback_secret');
    c.set('user', { id: payload.id as string, username: payload.username as string });
    await next();
  } catch (err) {
    deleteCookie(c, 'auth_token', { path: '/', secure: c.req.url.startsWith('https://') });
    return c.json({ success: false, error: 'Session Expired' }, 401);
  }
});

// --- AUTH ROUTES ---
const authSchema = z.object({ username: z.string().min(3), password: z.string().min(6) });
const handleValidation = (result: any, c: any) => {
  if (!result.success) return c.json({ success: false, error: 'Username (>3) or Password (>6) too short.' }, 400);
};

app.post('/api/auth/register', zValidator('json', authSchema, handleValidation), async (c) => {
  const { username, password } = c.req.valid('json');
  await ensureDB(c.env.DB);

  try {
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) return c.json({ success: false, error: 'Username taken' }, 400);

    const id = crypto.randomUUID();
    await c.env.DB.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(id, username, await hashPassword(password)).run();

    const token = await sign({ id, username, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env.JWT_SECRET || 'fallback_secret');
    setAuthCookie(c, token);
    return c.json({ success: true, user: { id, username, balance: 50.00 } });
  } catch (err: any) { 
    return c.json({ success: false, error: err.message }, 500); 
  }
});

app.post('/api/auth/login', zValidator('json', authSchema, handleValidation), async (c) => {
  const { username, password } = c.req.valid('json');
  await ensureDB(c.env.DB);

  try {
    const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE username = ? AND password_hash = ?')
      .bind(username, await hashPassword(password)).first();

    if (!user) return c.json({ success: false, error: 'Invalid credentials' }, 401);

    const token = await sign({ id: user.id as string, username: user.username as string, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env.JWT_SECRET || 'fallback_secret');
    setAuthCookie(c, token);
    return c.json({ success: true, user });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500); 
  }
});

app.post('/api/auth/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/', secure: c.req.url.startsWith('https://') });
  return c.json({ success: true });
});

app.get('/api/auth/me', protect, async (c) => {
  await ensureDB(c.env.DB);
  const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE id = ?').bind(c.get('user').id).first();
  return user ? c.json({ success: true, user }) : c.json({ success: false }, 401);
});

// --- SHOP & TRANSACTION ROUTES ---
app.get('/api/cards', protect, async (c) => {
  await ensureDB(c.env.DB);
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
      id: row.id || crypto.randomUUID(), // Fallback ID if bins is empty
      bin: row.bin || '414720',
      type: `${row.brand || 'VISA'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
      exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
      country: row.iso_code_2 || 'US',
      stateCityZip: `${row.country_name || 'USA'} / - / -`,
      base: BASES[Math.floor(Math.random() * BASES.length)],
      price: (Math.random() * (15 - 8) + 8).toFixed(2), 
    }));

    return c.json({ success: true, data: mapped, pagination: { total, totalPages: Math.max(1, Math.ceil(total / limit)) } });
  } catch (err: any) { 
    return c.json({ success: false, error: err.message }, 500); 
  }
});

app.post('/api/buy', protect, zValidator('json', z.object({ card: z.any() })), async (c) => {
  const user = c.get('user');
  const { card } = c.req.valid('json');
  const price = parseFloat(card.price);
  const db = c.env.DB;

  const dbUser = await db.prepare('SELECT balance FROM users WHERE id = ?').bind(user.id).first<{ balance: number }>();
  if (!dbUser || dbUser.balance < price) return c.json({ success: false, error: 'Insufficient funds' }, 400);

  const fullCC = `${card.bin}${Math.floor(1000000000 + Math.random() * 9000000000)}|${card.exp.replace('/', '|')}|${Math.floor(100 + Math.random() * 899)}`;
  const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

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
  await ensureDB(c.env.DB);
  const { results } = await c.env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(c.get('user').id).all();
  return c.json({ success: true, orders: results });
});

export default app;
