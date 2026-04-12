const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:JMgco%23HKwS8%25eD@db.egyagrxmlgvjfyarwawm.supabase.co:5432/postgres',
});
async function checkBatches() {
  await client.connect();
  const res = await client.query('SELECT code, school_name FROM public.school_batches');
  console.log('School Batches:', res.rows);
  await client.end();
}
checkBatches();
