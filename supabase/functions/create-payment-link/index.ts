const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studentName, studentEmail, studentPhone } = await req.json()

    if (!studentName || typeof studentName !== 'string') {
      return new Response(
        JSON.stringify({ error: 'studentName is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const keyId = Deno.env.get('RAZORPAY_KEY_ID')
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    if (!keyId || !keySecret) {
      return new Response(
        JSON.stringify({ error: 'Razorpay credentials not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const auth = btoa(`${keyId}:${keySecret}`)

    // Create a Razorpay Payment Link
    const response = await fetch('https://api.razorpay.com/v1/payment_links', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: 9900, // ₹99 in paise
        currency: 'INR',
        description: 'Future Canvas — Full Career Report',
        customer: {
          name: studentName,
          ...(studentEmail && { email: studentEmail }),
          ...(studentPhone && { contact: studentPhone }),
        },
        notify: {
          sms: !!studentPhone,
          email: !!studentEmail,
        },
        callback_url: '', // Will be set by the client
        callback_method: 'get',
        expire_by: Math.floor(Date.now() / 1000) + 30 * 60, // 30 min expiry
        notes: {
          product: 'future_canvas_report',
          student_name: studentName,
        },
      }),
    })

    if (!response.ok) {
      const errBody = await response.text()
      console.error('Razorpay API error:', errBody)
      return new Response(
        JSON.stringify({ error: 'Failed to create payment link' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const data = await response.json()

    return new Response(
      JSON.stringify({ short_url: data.short_url, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
