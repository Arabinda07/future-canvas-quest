const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:JMgco%23HKwS8%25eD@db.egyagrxmlgvjfyarwawm.supabase.co:5432/postgres',
});

async function check() {
  try {
    await client.connect();
    
    // Check tables
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables:', tables.rows.map(r => r.table_name));

  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}
check();
