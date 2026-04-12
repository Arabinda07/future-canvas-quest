const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:JMgco%23HKwS8%25eD@db.egyagrxmlgvjfyarwawm.supabase.co:5432/postgres',
});

async function test() {
  try {
    await client.connect();
    const res = await client.query('SELECT 1 as passed');
    console.log('Connection successful:', res.rows[0].passed === 1);
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

test();
