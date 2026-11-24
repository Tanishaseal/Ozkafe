# Ozkafe

React + Vite storefront with a Vercel Node.js payment API and Razorpay **test-mode** checkout. Uses the existing 60-product coffee catalogue. Guest delivery across India and café pickup are supported. Customer and order details are stored in Razorpay **order Notes**, with no separate database.

## Local setup

Use Node.js 22 or later. Copy `.env.example` to `.env.local` and supply these server-only values:

| Variable | Value |
| --- | --- |
| `RAZORPAY_KEY_ID` | Your Razorpay test key ID (`rzp_test_…`) |
| `RAZORPAY_KEY_SECRET` | The matching test key secret |
| `PAYMENT_SESSION_SECRET` | A random 32-byte key, encoded as 64 hexadecimal characters |

Generate the session key with `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Never prefix these variables with `VITE_`, commit credential files, or put the secret in frontend code. `.env.local` and `rzp-key.csv` are ignored by Git. The public key ID is returned to the browser when a test order is created.

```sh
npm install
npm run dev
```

Vite serves `/api/payments` locally through the same handler used by Vercel. `npm run preview` serves the static build only; use `npm run dev` to exercise the local API.

## Vercel setup

1. In this site's Vercel project, open **Settings → Environment Variables**. Add all three variables above to the deployment environments you intend to test (Production and/or Preview). Use the values from your local `.env.local` or your own generated session key. Do not paste secrets into GitHub or chat.
2. Set the project Node.js version to 22 or later. Keep build command `npm run build` and output directory `dist`.
3. Redeploy after saving environment variables. Pushing to GitHub does **not** copy local environment variables into Vercel.
4. Open `/api/payments` on the deployed domain. Expected: `{"enabled":true,"mode":"test"}`. No secret is returned. `enabled:false` means a variable is missing/invalid or live keys were supplied.
5. Add a coffee, complete guest checkout, and use Razorpay's [official test payment options](https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/integration-steps/) in its checkout window. Confirm the test payment and order Notes in the dashboard's test mode.

`api/payments.js` is a Vercel Function. `vercel.json` resolves files/functions before the SPA fallback; unknown `/api/*` paths return 404. A static-only upload of `dist` cannot process payments.

**This integration intentionally rejects live keys.** Test payments do not charge real funds or authorize fulfilment. Live payments require an explicit implementation change and a separate readiness review.

## Order flow and storage

1. The browser submits product selections and guest details. The server rebuilds products/prices from the catalogue, validates required fields, and calculates the INR amount in paise.
2. Before opening payment, the server creates a Razorpay order with complete contact, delivery/billing address, selected products, quantities, instructions and bill breakdown in Notes. It checks that Razorpay returned every field intact.
3. Razorpay Checkout collects payment information. Card, UPI, OTP and bank credentials are never collected or saved by Ozkafe.
4. The server validates the callback HMAC signature using its own order ID, fetches the order/payment from Razorpay, and verifies amount, currency and order association. An authorized test payment is captured server-side. Only a captured, non-refunded payment produces confirmation and removes purchased quantities from the cart.
5. Cancellation and verification/network failures preserve the cart. An encrypted checkout token in `sessionStorage` supports status checks and restoration in the same tab for 48 hours, including when a successful callback was lost. Retrying unchanged details reuses the same Razorpay order. Changing details requires checking/discarding the unpaid checkout first.

The cart stays in `localStorage`; plaintext customer/address details do not. In-progress form data and the visit's receipt list are held in React memory. Closing the tab or expiring the token ends browser recovery, but the merchant can still inspect the Razorpay order. There is no public order lookup, account system, database, webhook consumer, email confirmation, inventory reservation or shipping/tracking service. Use Razorpay's dashboard for the merchant record; this website does not promise permanent browser history or provider retention guarantees.

### Finding customer details in Razorpay

Switch the dashboard to **Test mode**, open **Orders**, search the `order_…` reference shown by the website, and inspect the order's Notes. These are order Notes; the integration does not assume they automatically appear on the payment entity.

| Notes section | Contents |
| --- | --- |
| `schema`, `fulfilment` | Record version and delivery/pickup choice |
| `customer_01`, etc. | Name, email and mobile number |
| `delivery_01`, etc. | Full delivery address, when applicable |
| `billing_01`, etc. or `billing` | Separate billing address or same-as-delivery indication |
| `items_01`, etc. | Catalogue ID, name, size, grind, quantity and unit price |
| `totals_01`, etc. | Subtotal, delivery, GST, total, weight and billing rates |
| `instructions_01`, etc. | Optional customer instructions |

Each numbered section is JSON split into ordered chunks. Concatenate `_01`, `_02`, etc. within that section to recover the full JSON. No address or instruction is silently truncated. [Razorpay allows at most 15 Notes fields of 256 characters each](https://razorpay.com/docs/api/orders/create/). If the complete order exceeds this capacity, checkout stops before creating a payment order and explains the limit. Large carts or long addresses may require contacting the café. This is a limit of using Notes without a separate database.

## Confirmed billing rules

- Guest checkout; online payment only.
- Delivery **₹80/kg per item**, proportional to pack weight and multiplied by quantity: 250g = ₹20, 1.5kg = ₹120. Cold brew uses the approved **1ml = 1g** conversion. Café pickup has no delivery fee.
- **5% GST on products plus delivery.** Two ₹226 packs of 250g: ₹452 products + ₹40 delivery + ₹24.60 GST = **₹516.60**. Pickup: **₹474.60**.
- Name, email and Indian mobile are required. Delivery requires recipient, street, city, state/UT and PIN. Separate billing and instructions are optional. Validation checks formats, not email/phone ownership or PIN serviceability.

## Navigation

| Route | Purpose |
| --- | --- |
| `/coffee-beans` | Existing catalogue and search |
| `/commercial`, `/single-origin`, `/instant-coffee` | Existing collection pages |
| `/product?id=cb-1` | Product, pack size, applicable grind and quantity |
| `/cart` | Items and estimated delivery/GST |
| `/checkout` | Guest details, delivery/pickup, test payment and recovery |
| `/confirmation?id=order_…` | Server-verified test receipt for the current visit |
| `/orders` | Verified test receipts from the current visit |

The separate Shop Coffee page is removed. Old `/shop` links redirect to `/coffee-beans`.

## Verification

```sh
npm test
npm run build
npm run lint
npm run test:ui
```

`npm test` covers price tampering, billing, required details, Notes round trips/limits, callback signatures, payment matching/capture, retries, expired tokens, recovery and HTTP origin/body protections.

For `test:ui`, start the dev server first. The dependency-free Chrome/CDP runner checks checkout, cancellation, rejected signatures, retry reuse, refresh recovery and responsive widths 320–1440px. It intercepts the payment endpoint and SDK **only inside its isolated test browser**, using synthetic provider data with the actual payment service. It makes no real Razorpay requests. Set `CHROME_PATH` or `STORE_URL` to override Windows Chrome or `http://127.0.0.1:5173`. Screenshots go under ignored `node_modules/.cache/ozkafe-qa/`.

For an explicit real-provider connectivity check:

```sh
node --env-file=.env.local scripts/check-razorpay.mjs
```

This creates **one unpaid test order** with synthetic details, fetches it back and checks persisted Notes. It does not attempt payment. Complete a test payment through Razorpay Checkout to verify the provider's full payment flow after deployment.
