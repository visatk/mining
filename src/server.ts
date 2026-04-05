import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Env } from '../worker-configuration';

const app = new Hono<{ Bindings: Env }>();

// List of known, valid, and high-value card providers to filter the database.
// This prevents junk/empty 'brand' records from showing up in the storefront.
const KNOWN_BRANDS = [
  'VISA', 
  'MASTERCARD', 
  'AMEX', 
  'AMERICAN EXPRESS',
  'DISCOVER', 
  'JCB', 
  'DINERS CLUB', 
  'UNIONPAY', 
  'MAESTRO'
];

// Dynamically generate placeholders for the SQL IN clause (e.g., "?, ?, ?")
const brandPlaceholders = KNOWN_BRANDS.map(() => '?').join(', ');

// API Route: Fetch and filter purchase cards from D1 with pagination
app.get(
  '/api/cards',
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
    const { bin, country, limit, page } = c.req.valid('query');
    
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const offset = (pageNum - 1) * limitNum;

    // Base query updated to strictly enforce known card brands using UPPER() for case insensitivity
    let baseQuery = `FROM bins WHERE UPPER(brand) IN (${brandPlaceholders})`;
    const params: (string | number)[] = [...KNOWN_BRANDS];

    // Apply dynamic filters
    if (bin) {
      baseQuery += ' AND bin LIKE ?';
      params.push(`${bin}%`);
    }

    if (country) {
      baseQuery += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)';
      params.push(`%${country}%`, `%${country}%`);
    }

    try {
      // 1. Get total count for frontend pagination UI
      const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
      const countResult = await c.env.DB.prepare(countQuery).bind(...params).first();
      const total = countResult ? Number((countResult as any).total) : 0;

      // 2. Fetch paginated records
      const query = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
      const { results } = await c.env.DB.prepare(query)
        .bind(...params, limitNum, offset)
        .all();

      // Transform DB records into a presentable format
      const mappedCards = results.map((row: any) => ({
        id: row.id,
        bin: row.bin,
        type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
        exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
        country: row.iso_code_2 || 'US',
        stateCityZip: `${row.country_name || 'United States'} / - / -`,
        base: 'APR#02_USA',
        price: (Math.random() * 20 + 10).toFixed(2), 
      }));

      // 3. Inject a Random BIN for the first row (Featured/Random Drop) if on page 1
      if (pageNum === 1) {
        // Ensure the random featured BIN is also selected ONLY from known providers
        const randomQuery = `SELECT * FROM bins WHERE UPPER(brand) IN (${brandPlaceholders}) ORDER BY RANDOM() LIMIT 1`;
        const randomBinResult = await c.env.DB.prepare(randomQuery).bind(...KNOWN_BRANDS).first();
        
        if (randomBinResult) {
          const randomRow = randomBinResult as any;
          mappedCards.unshift({
            id: `rnd-${randomRow.id}-${Date.now()}`,
            bin: randomRow.bin,
            type: `${randomRow.brand || 'UNKNOWN'} / ${randomRow.type || 'CREDIT'} / SPECIAL`,
            exp: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${Math.floor(Math.random() * 5) + 26}`,
            country: randomRow.iso_code_2 || 'US',
            stateCityZip: `${randomRow.country_name || 'United States'} (FEATURED DROP)`,
            base: 'RANDOM_DROP',
            price: (Math.random() * 30 + 15).toFixed(2),
          });
        }
      }

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
