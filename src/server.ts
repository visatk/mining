import { Hono } from 'hono';
import { z } from 'zod';
import { zValidator } from '@hono/zod-validator';
import { Env } from '../worker-configuration';
import { faker } from '@faker-js/faker';

const app = new Hono<{ Bindings: Env }>();

// API Route: Fetch User Profile & Balance
app.get('/api/user', (c) => {
  return c.json({
    success: true,
    data: {
      id: 'usr_1',
      username: 'buyer_007',
      balance: 145.50,
      currency: 'USD'
    }
  });
});

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

    if (bin) {
      query += ' AND bin LIKE ?';
      params.push(`${bin}%`);
    }

    if (country) {
      query += ' AND (iso_code_2 LIKE ? OR country_name LIKE ?)';
      params.push(`%${country}%`, `%${country}%`);
    }

    try {
      // 1. Fetch raw BIN records from D1 (fallback to empty array if table isn't seeded)
      let results: any[] = [];
      try {
        const dbRes = await c.env.DB.prepare(query).bind(...params).all();
        results = dbRes.results;
      } catch (e) {
        // Fallback for development if D1 isn't initialized
        results = [{ id: 1, bin: '414720', iso_code_2: 'US', brand: 'VISA', type: 'CREDIT', category: 'SIGNATURE' }];
      }

      // 2. Generate a realistic, deterministic marketplace inventory
      let allCards: any[] = [];
      
      for (const row of results) {
        const binBaseSeed = parseInt(row.bin as string, 10) || 414720;
        faker.seed(binBaseSeed); 
        
        const numCards = faker.number.int({ min: 12, max: 35 });
        
        for (let i = 0; i < numCards; i++) {
          const cardSeed = binBaseSeed + (i * 999);
          faker.seed(cardSeed);
          
          const expMonth = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
          const expYear = faker.number.int({ min: 26, max: 32 });
          
          const cardState = faker.location.state({ abbreviated: true });
          const cardCity = faker.location.city();
          const cardZip = faker.location.zipCode('#####');
          
          const month = faker.date.month({ abbreviated: true }).toUpperCase();
          const day = faker.number.int({min: 1, max: 30}).toString().padStart(2, '0');
          const quality = faker.helpers.arrayElement(['GREAT', 'GOOD', 'MIX', 'FRESH']);
          const baseName = `${month}#${day}_${row.iso_code_2 || 'US'}[${quality}]`;

          allCards.push({
            id: `${row.id || 'c'}-${i}-${cardSeed}`,
            bin: row.bin || '414720',
            type: `${row.brand || 'UNKNOWN'} / ${row.type || 'CREDIT'} / ${row.category || 'CLASSIC'}`,
            exp: `${expMonth}/${expYear}`,
            country: row.iso_code_2 || 'US',
            stateCityZip: `${cardState} / ${cardCity} / ${cardZip}`,
            rawState: cardState,
            rawCity: cardCity,
            rawZip: cardZip,
            base: baseName,
            price: parseFloat(faker.commerce.price({ min: 15, max: 75, dec: 2 })), 
          });
        }
      }

      // 3. Apply JS-level filters
      if (state) allCards = allCards.filter(c => c.rawState.toLowerCase() === state.toLowerCase());
      if (city) allCards = allCards.filter(c => c.rawCity.toLowerCase().includes(city.toLowerCase()));
      if (zip) allCards = allCards.filter(c => c.rawZip.startsWith(zip));
      if (base) allCards = allCards.filter(c => c.base.toLowerCase().includes(base.toLowerCase()));

      const maxLimit = parseInt(limit, 10);
      const totalFound = allCards.length;
      const finalCards = allCards.slice(0, maxLimit);

      return c.json({ success: true, data: finalCards, total: totalFound });
    } catch (error: any) {
      return c.json({ success: false, error: error.message }, 500);
    }
  }
);

// API Route: Mock Purchase Action
app.post('/api/buy', zValidator('json', z.object({ id: z.string(), price: z.number() })), async (c) => {
  const { id, price } = c.req.valid('json');
  // In a real scenario: verify balance, lock row in D1, deduct balance, insert into orders.
  return c.json({ 
    success: true, 
    message: 'Card purchased successfully.',
    deducted: price
  });
});

// API Route: Fetch Orders
app.get('/api/orders', (c) => {
  faker.seed(999);
  const orders = Array.from({ length: 8 }).map((_, i) => {
    const expMonth = faker.number.int({ min: 1, max: 12 }).toString().padStart(2, '0');
    const expYear = faker.number.int({ min: 26, max: 32 });
    const fullCard = faker.finance.creditCardNumber('visa');
    
    return {
      id: `ORD-${faker.string.alphanumeric(8).toUpperCase()}`,
      date: faker.date.recent({ days: 15 }).toISOString(),
      cardDetails: `${fullCard}|${expMonth}|${expYear}|${faker.finance.creditCardCVV()}`,
      type: 'VISA / CREDIT / PLATINUM',
      base: 'MAR#22_US[GREAT]',
      price: parseFloat(faker.commerce.price({ min: 20, max: 60, dec: 2 }))
    };
  });
  
  // Sort by date descending
  orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return c.json({ success: true, data: orders });
});

export default app;
