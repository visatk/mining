import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { sign, verify } from 'hono/jwt';
import { setCookie, getCookie, deleteCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  ASSETS: Fetcher; // Required for Cloudflare Pages/Assets binding
}

type Variables = { user: { id: string; username: string } };
const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// --- CLOUDFLARE WORKER LIFECYCLE OPTIMIZATION ---
let dbInitialized = false;

const ensureDB = async (db: D1Database) => {
  if (dbInitialized) return;
  
  // FIX: db.exec() causes runtime crashes in Workers. 
  // We must use db.batch() with prepared statements for D1 stability.
  await db.batch([
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        balance REAL DEFAULT 50.00,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        item_reference TEXT NOT NULL,
        card_details TEXT NOT NULL,
        amount REAL NOT NULL,
        status TEXT DEFAULT 'COMPLETED',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `),
    db.prepare(`
      CREATE TABLE IF NOT EXISTS bins (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bin TEXT,
        brand TEXT,
        type TEXT,
        category TEXT,
        iso_code_2 TEXT,
        country_name TEXT
      )
    `)
  ]);
  
  dbInitialized = true;
};

// --- SECURITY UPGRADE: Safely derived PBKDF2 ---
const hashPassword = async (password: string): Promise<string> => {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"] // Only request deriveBits to avoid strict export restrictions
  );
  
  const salt = enc.encode("elonmoney_secure_salt_2026");
  
  // FIX: Use deriveBits directly. exportKey on derived AES-GCM throws DOMExceptions in Workers.
  const hashBuffer = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256
  );
  
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
};

const setAuthCookie = (c: any, token: string) => {
  const isSecure = c.req.url.startsWith('https://');
  setCookie(c, 'auth_token', token, { 
    httpOnly: true, 
    secure: isSecure, 
    sameSite: 'Lax', 
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 1 week
  });
};

const protect = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'auth_token');
  if (!token) return c.json({ success: false, error: 'Unauthorized - Missing Cookie' }, 401);
  try {
    const secret = c.env.JWT_SECRET || 'dev_fallback_secret_only';
    const payload = await verify(token, secret);
    c.set('user', { id: payload.id as string, username: payload.username as string });
    await next();
  } catch (err) {
    deleteCookie(c, 'auth_token', { path: '/', secure: c.req.url.startsWith('https://') });
    return c.json({ success: false, error: 'Session Expired' }, 401);
  }
});

const authSchema = z.object({ username: z.string().min(3), password: z.string().min(6) });
const handleValidation = (result: any, c: any) => {
  if (!result.success) return c.json({ success: false, error: 'Invalid payload: username (>3), password (>6)' }, 400);
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', zValidator('json', authSchema, handleValidation), async (c) => {
  await ensureDB(c.env.DB);
  const { username, password } = c.req.valid('json');

  try {
    const existing = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) return c.json({ success: false, error: 'Identity alias already registered' }, 400);

    const id = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);
    
    await c.env.DB.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(id, username, hashedPassword).run();

    const token = await sign({ id, username, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env.JWT_SECRET || 'dev_fallback_secret_only');
    setAuthCookie(c, token);
    return c.json({ success: true, user: { id, username, balance: 50.00 } });
  } catch (err: any) { 
    return c.json({ success: false, error: err.message }, 500); 
  }
});

app.post('/api/auth/login', zValidator('json', authSchema, handleValidation), async (c) => {
  await ensureDB(c.env.DB);
  const { username, password } = c.req.valid('json');

  try {
    const hashedPassword = await hashPassword(password);
    const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE username = ? AND password_hash = ?')
      .bind(username, hashedPassword).first();

    if (!user) return c.json({ success: false, error: 'Invalid authentication credentials' }, 401);

    const token = await sign({ id: user.id as string, username: user.username as string, exp: Math.floor(Date.now() / 1000) + 604800 }, c.env.JWT_SECRET || 'dev_fallback_secret_only');
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
    const mapped = (results.length > 0 ? results : Array.from({ length: 15 })).map((row: any, i) => ({
      id: row?.id || crypto.randomUUID(),
      bin: row?.bin || `4147${Math.floor(10 + Math.random() * 90)}`,
      type: row ? `${row.brand} / ${row.type} / ${row.category}` : 'VISA / CREDIT / CLASSIC',
      exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
      country: row?.iso_code_2 || (i % 2 === 0 ? 'US' : 'UK'),
      base: BASES[Math.floor(Math.random() * BASES.length)],
      price: (Math.random() * (25 - 12) + 12).toFixed(2), 
    }));

    const finalTotal = total > 0 ? total : 15;
    return c.json({ success: true, data: mapped, pagination: { total: finalTotal, totalPages: Math.max(1, Math.ceil(finalTotal / limit)) } });
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
  if (!dbUser || dbUser.balance < price) return c.json({ success: false, error: 'Insufficient funds balance' }, 400);

  const fullCC = `${card.bin}${Math.floor(1000000000 + Math.random() * 9000000000)}|${card.exp.replace('/', '|')}|${Math.floor(100 + Math.random() * 899)}`;
  const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`;

  try {
    await db.batch([
      db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(price, user.id),
      db.prepare('INSERT INTO orders (id, user_id, item_reference, card_details, amount) VALUES (?, ?, ?, ?, ?)')
        .bind(orderId, user.id, `${card.bin} - ${card.base}`, fullCC, price)
    ]);
    return c.json({ success: true, newBalance: dbUser.balance - price, orderId });
  } catch (err: any) {
    return c.json({ success: false, error: 'Database transaction failed' }, 500);
  }
});

app.get('/api/orders', protect, async (c) => {
  await ensureDB(c.env.DB);
  const { results } = await c.env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').bind(c.get('user').id).all();
  return c.json({ success: true, orders: results });
});

// FIX: React Router SPA Fallback
// If a user hard-refreshes on a frontend route, Hono must serve index.html from ASSETS
app.get('*', async (c) => {
  if (c.req.path.startsWith('/api/')) {
    return c.json({ success: false, error: 'API Endpoint Not Found' }, 404);
  }
  if (c.env.ASSETS) {
    return c.env.ASSETS.fetch(new Request(new URL('/', c.req.url)));
  }
  return c.text('ASSETS binding not found.', 500);
});

export default app;
