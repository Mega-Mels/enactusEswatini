import { NextResponse } from 'next/server'

/**
 * MTN MoMo (Collection) – Request To Pay (RTP)
 *
 * This route is a SAFE starter template.
 * - Put secrets in .env.local (never commit keys).
 * - MTN MoMo uses different base URLs for sandbox vs live.
 *
 * Docs: https://momodeveloper.mtn.com/api-documentation
 */

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))

    // In your UI you’d typically pass:
    // { amount: "100", currency: "SZL", payer: { partyId: "76xxxxxx", partyIdType: "MSISDN" }, payerMessage, payeeNote }

    const {
      amount = '100',
      currency = process.env.MOMO_CURRENCY || 'SZL',
      payer,
      payerMessage = 'Enactus donation',
      payeeNote = 'Thank you for supporting youth impact',
      externalId,
    } = body || {}

    // Required env vars
    const BASE_URL = process.env.MOMO_BASE_URL // e.g. https://sandbox.momodeveloper.mtn.com
    const TARGET_ENV = process.env.MOMO_TARGET_ENV || 'sandbox' // sandbox | mtnswaziland | ...
    const SUB_KEY = process.env.MOMO_SUBSCRIPTION_KEY
    const ACCESS_TOKEN = process.env.MOMO_ACCESS_TOKEN
    const CALLBACK_URL = process.env.MOMO_CALLBACK_URL // optional

    if (!BASE_URL || !SUB_KEY) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'MoMo config missing. Set MOMO_BASE_URL and MOMO_SUBSCRIPTION_KEY in .env.local. See MTN_MOMO_SETUP.md',
        },
        { status: 500 }
      )
    }

    if (!ACCESS_TOKEN) {
      return NextResponse.json(
        {
          ok: false,
          error:
            'Access token missing. Create an access token server-side (recommended) and set MOMO_ACCESS_TOKEN for testing. See MTN_MOMO_SETUP.md',
        },
        { status: 500 }
      )
    }

    // Generate a UUID reference for the transaction
    const referenceId = crypto.randomUUID()

    // Basic validation
    if (!payer?.partyId) {
      return NextResponse.json(
        { ok: false, error: 'payer.partyId is required (MSISDN phone number)' },
        { status: 400 }
      )
    }

    const res = await fetch(`${BASE_URL}/collection/v1_0/requesttopay`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': TARGET_ENV,
        'Ocp-Apim-Subscription-Key': SUB_KEY,
        'Content-Type': 'application/json',
        ...(CALLBACK_URL ? { 'X-Callback-Url': CALLBACK_URL } : {}),
      },
      body: JSON.stringify({
        amount: String(amount),
        currency,
        externalId: externalId || referenceId,
        payer: {
          partyIdType: payer.partyIdType || 'MSISDN',
          partyId: payer.partyId,
        },
        payerMessage,
        payeeNote,
      }),
    })

    // MoMo often returns 202 Accepted for RTP
    const text = await res.text()

    return NextResponse.json(
      {
        ok: res.ok,
        status: res.status,
        referenceId,
        response: text,
      },
      { status: res.ok ? 200 : res.status }
    )
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Unknown error' }, { status: 500 })
  }
}
