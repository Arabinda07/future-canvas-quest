const VITE_SUPABASE_URL = "https://egyagrxmlgvjfyarwawm.supabase.co";
const VITE_SUPABASE_ANON_KEY = "sb_publishable_GzWB6ou4cq0wFxR_ZZn3dA_NWoMNarI";

async function testFunction(name) {
  try {
    const res = await fetch(`${VITE_SUPABASE_URL}/functions/v1/${name}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });
    const text = await res.text();
    console.log(`Function ${name} status:`, res.status, res.statusText);
    console.log(`Response:`, text.substring(0, 50));
  } catch (error) {
    console.error(`Fetch failed for ${name}:`, error.message);
  }
}

async function check() {
  await testFunction('process-assessment');
  await testFunction('validate-counselor-access');
}

check();
