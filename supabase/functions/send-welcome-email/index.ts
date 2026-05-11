import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req: Request) => {
  // CORS pro jistotu
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const payload = await req.json()
    const { record } = payload // Data ze Supabase Webhooku

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Sudoku Cup <onboarding@resend.dev>',
        to: [record.email],
        subject: `Registrace týmu: ${record.team_name}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 40px; border-radius: 16px;">
            <h1 style="color: #6366f1; text-transform: uppercase; font-style: italic;">Sudoku Cup 2026</h1>
            <p>Ahoj kapitáne!</p>
            <p>Tvůj tým <strong>${record.team_name}</strong> byl úspěšně přihlášen do turnaje.</p>
            
            <div style="background: #1a1a1a; padding: 24px; border-radius: 12px; border: 1px solid #333; margin: 30px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 2px;">Tvůj přístupový kód</p>
              <p style="margin: 10px 0 0 0; font-size: 42px; font-weight: 900; color: #deff9a; letter-spacing: 8px;">${record.access_code}</p>
            </div>

            <p style="font-size: 14px; color: #888;">Tento kód použij pro přihlášení do sekce kapitána na našem webu.</p>
            <p style="margin-top: 40px; font-size: 12px; color: #444; border-top: 1px solid #222; padding-top: 20px;">
              Tento e-mail byl odeslán automaticky systémem Nexoria.
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: 200 })

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})