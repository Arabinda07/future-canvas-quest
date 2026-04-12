const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:JMgco%23HKwS8%25eD@db.egyagrxmlgvjfyarwawm.supabase.co:5432/postgres',
});
async function retireBatch() {
  await client.connect();
  const res = await client.query(`
    UPDATE public.school_batches 
    SET valid_until = NOW() 
    WHERE code = 'KVKGP2025'
  `);
  console.log('Retired batches count:', res.rowCount);
  await client.end();
}
retireBatch();
