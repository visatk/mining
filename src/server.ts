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

// Define the variables we will pass through the Hono context
type Variables = {
  user: { id: string; username: string };
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// Helper: Password Hashing (using native Web Crypto API)
const hashPassword = async (password: string) => {
  const msgUint8 = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- AUTH MIDDLEWARE ---
// This locks down any route it's attached to.
const protect = createMiddleware<{ Bindings: Env; Variables: Variables }>(async (c, next) => {
  const token = getCookie(c, 'auth_token');
  
  if (!token) {
    return c.json({ success: false, error: 'Unauthorized - Missing Token' }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET || 'fallback_secret');
    // Attach the verified user to the request context
    c.set('user', { id: payload.id as string, username: payload.username as string });
    await next();
  } catch (err) {
    // If token is invalid/expired, clear the cookie and reject
    deleteCookie(c, 'auth_token', { path: '/' });
    return c.json({ success: false, error: 'Unauthorized - Invalid or Expired Token' }, 401);
  }
});

// --- PUBLIC AUTHENTICATION ROUTES ---

app.post('/api/auth/register', zValidator('json', z.object({
  username: z.string().min(3).max(30),
  password: z.string().min(6)
})), async (c) => {
  const { username, password } = c.req.valid('json');
  const db = c.env.DB;

  try {
    const existing = await db.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
    if (existing) return c.json({ success: false, error: 'Username already taken' }, 400);

    const id = crypto.randomUUID();
    const hashedPassword = await hashPassword(password);

    await db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(id, username, hashedPassword)
      .run();

    const token = await sign({ id, username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, c.env.JWT_SECRET || 'fallback_secret');
    setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

    return c.json({ success: true, user: { id, username, balance: 0 } });
  } catch (err: any) {
    return c.json({ success: false, error: err.message }, 500);
  }
});

app.post('/api/auth/login', zValidator('json', z.object({
  username: z.string(),
  password: z.string()
})), async (c) => {
  const { username, password } = c.req.valid('json');
  const hashedPassword = await hashPassword(password);

  const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE username = ? AND password_hash = ?')
    .bind(username, hashedPassword)
    .first<{ id: string, username: string, balance: number }>();

  if (!user) return c.json({ success: false, error: 'Invalid credentials' }, 401);

  const token = await sign({ id: user.id, username: user.username, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 }, c.env.JWT_SECRET || 'fallback_secret');
  setCookie(c, 'auth_token', token, { httpOnly: true, secure: true, sameSite: 'Strict', path: '/' });

  return c.json({ success: true, user });
});

app.post('/api/auth/logout', (c) => {
  deleteCookie(c, 'auth_token', { path: '/' });
  return c.json({ success: true });
});

// Protect the /me route to ensure the token is valid on load
app.get('/api/auth/me', protect, async (c) => {
  const sessionUser = c.get('user');
  
  try {
    const user = await c.env.DB.prepare('SELECT id, username, balance FROM users WHERE id = ?')
      .bind(sessionUser.id)
      .first();

    if (!user) throw new Error('User not found in DB');
    return c.json({ success: true, user });
  } catch {
    deleteCookie(c, 'auth_token', { path: '/' });
    return c.json({ success: false }, 401);
  }
});

// --- PROTECTED CARD INVENTORY ROUTES ---

app.get(
  '/api/cards',
  protect, // <--- Apply the middleware to lock this route down
  zValidator(
    'query',
    z.object({
      bin: z.string().optional(),
      country: z.string().optional(),
      limit: z.string().optional().default('50'),
      page: z.string().optional().default('1'),
    })
  ),
  async (c) => {
    // You now have guaranteed access to the authenticated user here:
    // const user = c.get('user'); 
    
    const { bin, country, limit, page } = c.req.valid('query');
    
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = `FROM bins WHERE SUBSTR(bin, 1, 1) IN ('3', '4', '5', '6')`;
    const params: (string | number)[] = [];

    if (bin) {
      baseQuery += ' AND bin LIKE ?';
      params.push(`${bin}%`);
    }

    if (country) {
      baseQuery += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)';
      params.push(`%${country}%`, `%${country}%`);
    }

    try {
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const countResult = await c.env.DB.prepare(countQuery).bind(...params).first();
      const total = countResult ? Number((countResult as any).total) : 0;

      const query = `SELECT * ${baseQuery} ORDER BY RANDOM() LIMIT ? OFFSET ?`;
      const { results } = await c.env.DB.prepare(query)
        .bind(...params, limitNum, offset)
        .all();

      const RANDOM_BASES = ['APR#02_USA', 'MAY#01_MIX', 'JUN#12_UK', 'APR#15_CA', 'MAR#99_AU', 'FEB#04_EU'];

      const mappedCards = results.map((row: any) => ({
        id: row.id,
        bin: row.bin,
        type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
        exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
        country: row.iso_code_2 || 'US',
        stateCityZip: `${row.country_name || 'United States'} / - / -`,
        base: RANDOM_BASES[Math.floor(Math.random() * RANDOM_BASES.length)],
        price: (Math.random() * (15 - 8) + 8).toFixed(2), 
      }));

      return c.json({ 
        success: true, 
        data: mappedCards,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        }
      });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  }
);

export default app;
