# MTN MoMo setup (developer guide)

This project already **defaults to MTN MoMo** in the Donations UI.

To enable *real* MoMo payments (Request-to-Pay), you’ll wire up the MTN MoMo **Collection API** on the server.

> Important: never put MoMo keys in the browser. Use **server routes** (Next.js `app/api/*`) + `.env.local`.

## 1) Which APIs to use

For donations, start with **Collection**:
- Create API user
- Create API key
- Generate access token
- Request-to-Pay (RTP)
- Poll payment status (optional)

Official docs: https://momodeveloper.mtn.com/api-documentation

## 2) Environment variables

Create a `.env.local` in your project root:

```bash
# Sandbox base URL
MOMO_BASE_URL=https://sandbox.momodeveloper.mtn.com

# Sandbox target environment
MOMO_TARGET_ENV=sandbox

# From your MoMo developer profile subscription for Collection API
MOMO_SUBSCRIPTION_KEY=YOUR_SUBSCRIPTION_KEY

# Currency for Eswatini
MOMO_CURRENCY=SZL

# Optional callback (if you have a public URL)
# MOMO_CALLBACK_URL=https://your-domain.com/api/momo/callback

# For quick testing only:
# MOMO_ACCESS_TOKEN=...
```

## 3) How authentication works (simple version)

MTN MoMo uses:
- a **Subscription Key** (Ocp-Apim-Subscription-Key)
- an **API user** + **API key** (used to mint an access token)
- an **access token** (Bearer token) for the actual payment calls

You should mint the access token **server-side**, then call Request-to-Pay.

## 4) Starter endpoint included in this zip

This zip adds a template route:

- `POST /api/momo/request-to-pay`

File:
- `src/app/api/momo/request-to-pay/route.ts`

It shows the exact headers needed (`X-Reference-Id`, `X-Target-Environment`, `Ocp-Apim-Subscription-Key`, `Authorization`).

### Example request (from your own frontend)

```ts
await fetch('/api/momo/request-to-pay', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: '100',
    currency: 'SZL',
    payer: { partyIdType: 'MSISDN', partyId: '76XXXXXX' },
    payerMessage: 'Enactus donation',
    payeeNote: 'Thank you!',
  }),
})
```

## 5) Getting an access token (recommended improvement)

Right now the template expects `MOMO_ACCESS_TOKEN` so you can test quickly.

For production, add a second server route that:
1) calls the MoMo token endpoint with your API user + apiKey
2) returns the token (or stores it briefly in memory/DB with expiry)

Then update the RTP route to call that token route instead of using `MOMO_ACCESS_TOKEN`.

## 6) Running the app locally

You got this error:

> Could not find a production build in the '.next' directory...

That happens when you run `next start` without building.

Use **one** of these:

```bash
# Development (recommended while building)
npm run dev

# Production
npm run build
npm start
```

---

If you want, paste your current `package.json` and I can suggest the cleanest scripts (`dev`, `build`, `start`).
