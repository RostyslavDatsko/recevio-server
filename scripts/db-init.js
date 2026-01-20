import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import pkg from 'pg';

const { Client } = pkg;

dotenv.config();

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME
} = process.env;

const schemaPath = path.resolve('db/schema/receipt_schema_postgres.sql');
const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

async function createDatabaseIfNotExists() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: 'postgres'
  });

  await client.connect();

  const res = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [DB_NAME]
  );

  if (res.rowCount === 0) {
    console.log(`==> Creating database: ${DB_NAME}`);
    await client.query(`CREATE DATABASE "${DB_NAME}"`);
  } else {
    console.log(`==> Database already exists: ${DB_NAME}`);
  }

  await client.end();
}

async function applySchema() {
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
  });

  await client.connect();
  console.log('==> Applying schema');

  await client.query(schemaSQL);

  await client.end();
}

(async () => {
  try {
    await createDatabaseIfNotExists();
    await applySchema();
    console.log('✅ Database initialized successfully');
  } catch (err) {
    console.error('❌ DB init failed');
    console.error(err);
    process.exit(1);
  }
})();
