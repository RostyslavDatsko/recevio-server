import dotenv from 'dotenv';
import pkg from 'pg';

const { Client } = pkg;
dotenv.config();

/* =======================
   CONFIG
======================= */

const RECEIPT_COUNT = Number(process.env.SEED_RECEIPTS ?? 100);

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

/* =======================
   DB CLIENT
======================= */

const client = new Client({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME
});

/* =======================
   HELPERS
======================= */

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randFrom = arr => arr[rand(0, arr.length - 1)];

const randomDate = () => {
  const daysAgo = rand(1, 180);
  return new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);
};

/* =======================
   SEED DATA
======================= */

const merchants = [
  { name: 'Tommy Hilfiger', address: 'Dufferin Mall' },
  { name: 'Walmart', address: 'Toronto ON' },
  { name: 'Costco', address: 'Mississauga ON' },
  { name: 'Nike', address: 'Yorkdale Mall' },
  { name: 'Adidas', address: 'Toronto Eaton Centre' }
];

const itemNames = [
  'Socks',
  'T-Shirt',
  'Jeans',
  'Jacket',
  'Shoes',
  'Hat',
  'Backpack',
  'Sweater'
];

const discountTemplates = [
  { name: '10% off', percent: 10 },
  { name: '15% off entire', percent: 15 },
  { name: 'Clearance 30%', percent: 30 }
];

const taxes = [
  { name: 'HST-ON', rate: 13.0 }
];

/* =======================
   SEED LOGIC
======================= */

async function seed() {
  await client.connect();
  console.log(`==> Seeding ${RECEIPT_COUNT} receipts`);

  /* ---- merchants ---- */
  const merchantIds = [];
  for (const m of merchants) {
    const r = await client.query(
      `INSERT INTO merchants (name, address)
       VALUES ($1, $2)
       RETURNING id`,
      [m.name, m.address]
    );
    merchantIds.push(r.rows[0].id);
  }

  /* ---- taxes ---- */
  const taxIds = [];
  for (const t of taxes) {
    const r = await client.query(
      `INSERT INTO taxes (name, rate_percent)
       VALUES ($1, $2)
       RETURNING id`,
      [t.name, t.rate]
    );
    taxIds.push(r.rows[0].id);
  }

  /* ---- discounts ---- */
  const discountIds = [];
  for (const d of discountTemplates) {
    const r = await client.query(
      `INSERT INTO discounts (type, amount)
       VALUES ($1, 0)
       RETURNING id`,
      [d.name]
    );
    discountIds.push({ id: r.rows[0].id, ...d });
  }

  /* ---- receipts ---- */
  for (let i = 0; i < RECEIPT_COUNT; i++) {
    const receiptDate = randomDate();
    const subtotal = rand(20, 300);
    const total = +(subtotal * 1.13).toFixed(2);

    const receipt = await client.query(
      `INSERT INTO receipts (subtotal, total, date)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [subtotal, total, receiptDate]
    );

    const receiptId = receipt.rows[0].id;

    /* merchant link */
    await client.query(
      `INSERT INTO merchant_receipts VALUES ($1, $2)`,
      [randFrom(merchantIds), receiptId]
    );

    /* tax link */
    await client.query(
      `INSERT INTO tax_receipts VALUES ($1, $2)`,
      [taxIds[0], receiptId]
    );

    /* items */
    const itemCount = rand(1, 5);

    for (let j = 0; j < itemCount; j++) {
      const itemName = randFrom(itemNames);
      const originalPrice = rand(20, 150);
      const discount = randFrom(discountIds);
      const discountedPrice = +(originalPrice * (1 - discount.percent / 100)).toFixed(2);

      const item = await client.query(
        `INSERT INTO items
          (name, quantity, unit_price, original_unit_price, total_price)
         VALUES ($1, 1, $2, $3, $2)
         RETURNING id`,
        [itemName, discountedPrice, originalPrice]
      );

      const itemId = item.rows[0].id;

      await client.query(
        `INSERT INTO receipt_items VALUES ($1, $2)`,
        [receiptId, itemId]
      );

      await client.query(
        `INSERT INTO item_discounts (item_id, discount_id, amount, name)
         VALUES ($1, $2, $3, $4)`,
        [
          itemId,
          discount.id,
          +(originalPrice - discountedPrice).toFixed(2),
          discount.name
        ]
      );
    }
  }

  await client.end();
  console.log('✅ Seed completed successfully');
}

/* =======================
   RUN
======================= */

seed().catch(err => {
  console.error('❌ Seed failed');
  console.error(err);
  process.exit(1);
});
