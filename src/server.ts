import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Env } from '../worker-configuration';
import { faker } from '@faker-js/faker';

const app = new Hono<{ Bindings: Env }>();

// API Route: Fetch and filter purchase cards from D1 + Faker
app.get(
  '/api/cards',
  zValidator(
    'query',
    z.object({
      bin: z.string().optional(),
      country: z.string().optional(),
      state: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
      base: z.string().optional(),
      limit: z.string().optional().default('200'),
    })
  ),
  async (c) => {
    const { bin, country, state, city, zip, base, limit } = c.req.valid('query');

    let query = 'SELECT * FROM bins WHERE 1=1';
    const params: (string | number)[] = [];

    // Apply SQL filters for actual DB columns
    if (bin) {
      query += ' AND bin LIKE ?';
      params.push(`${bin}%`);
    }

    if (country) {
      query += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)';
      params.push(`%${country}%`, `%${country}%`);
    }

    try {
      // 1. Fetch raw BIN records from D1
      const { results } = await c.env.DB.prepare(query)
        .bind(...params)
        .all();

      // 2. Generate a realistic, deterministic marketplace inventory
      let allCards: any[] = [];
      
      for (const row of results) {
        // Use the BIN as a base seed to ensure deterministic but varied generation.
        // This ensures the same DB always yields the same store inventory.
        const binBaseSeed = parseInt(row.bin as string, 10);
        faker.seed(binBaseSeed); 
        
        // Generate between 12 to 35 cards per BIN to populate the store densely
        const numCards = faker.number.int({ min: 12, max: 35 });
        
        for (let i = 0; i < numCards; i++) {
          const cardSeed = binBaseSeed + (i * 999);
          faker.seed(cardSeed);
          
          const expMonth = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
          const expYear = faker.number.int({ min: 26, max: 32 });
          
          const cardState = faker.location.state({ abbreviated: true });
          const cardCity = faker.location.city();
          const cardZip = faker.location.zipCode('#####');
          
          // Generate realistic database base names (e.g. "APR#14_US[GREAT]")
          const month = faker.date.month({ abbreviated: true }).toUpperCase();
          const day = faker.number.int({min: 1, max: 30}).toString().padStart(2, '0');
          const quality = faker.helpers.arrayElement(['GREAT', 'GOOD', 'MIX', 'FRESH']);
          const baseName = `${month}#${day}_${row.iso_code_2 || 'US'}[${quality}]`;

          allCards.push({
            id: `${row.id}-${i}`,
            bin: row.bin,
            type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
            exp: `${expMonth}/${expYear}`,
            country: row.iso_code_2 || 'US',
            stateCityZip: `${cardState} / ${cardCity} / ${cardZip}`,
            rawState: cardState,
            rawCity: cardCity,
            rawZip: cardZip,
            base: baseName,
            price: faker.commerce.price({ min: 15, max: 75, dec: 2 }), 
          });
        }
      }

      // 3. Apply JS-level filters for the dynamically generated Faker fields
      if (state) {
        allCards = allCards.filter(c => c.rawState.toLowerCase() === state.toLowerCase());
      }
      if (city) {
        allCards = allCards.filter(c => c.rawCity.toLowerCase().includes(city.toLowerCase()));
      }
      if (zip) {
        allCards = allCards.filter(c => c.rawZip.startsWith(zip));
      }
      if (base) {
        allCards = allCards.filter(c => c.base.toLowerCase().includes(base.toLowerCase()));
      }

      // Sort randomly but deterministically based on today's date, or just leave as is
      const maxLimit = parseInt(limit, 10);
      const totalFound = allCards.length;
      const finalCards = allCards.slice(0, maxLimit);

      return c.json({ success: true, data: finalCards, total: totalFound });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  }
);

export default app;
