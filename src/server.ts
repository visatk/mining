import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Env } from '../worker-configuration';

const app = new Hono<{ Bindings: Env }>();

// API Route: Fetch and filter purchase cards from D1
app.get(
  '/api/cards',
  zValidator(
    'query',
    z.object({
      bin: z.string().optional(),
      country: z.string().optional(),
      limit: z.string().optional().default('100'),
    })
  ),
  async (c) => {
    const { bin, country, limit } = c.req.valid('query');

    let query = 'SELECT * FROM bins WHERE 1=1';
    const params: (string | number)[] = [];

    // Apply dynamic filters
    if (bin) {
      query += ' AND bin LIKE ?';
      params.push(`${bin}%`);
    }

    if (country) {
      query += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)';
      params.push(`%${country}%`, `%${country}%`);
    }

    query += ' LIMIT ?';
    params.push(parseInt(limit, 10));

    try {
      const { results } = await c.env.DB.prepare(query)
        .bind(...params)
        .all();

      // Transform DB records into a presentable format for the storefront
      const mappedCards = results.map((row: any) => ({
        id: row.id,
        bin: row.bin,
        type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
        // Mocking dynamic storefront properties not stored directly in the static BIN table
        exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
        country: row.iso_code_2 || 'US',
        stateCityZip: `${row.country_name || 'United States'} / - / -`,
        base: 'APR#02_USA',
        price: (Math.random() * 20 + 10).toFixed(2), 
      }));

      return c.json({ success: true, data: mappedCards });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  }
);

export default app;
