# Ozkafe

React + Vite website and storefront UI. The existing cafe, brand and collection pages remain available. The storefront uses the repository's 60-product coffee catalog and product photography.

## Run locally

```sh
npm install
npm run dev
```

Open the URL printed by Vite, then choose **Shop Coffee**. The home page's coffee links also open the shop.

```sh
npm run build
npm test
```

For the browser walkthrough, keep the dev server running and run `npm run test:ui` in another terminal. It uses a temporary Chrome profile, Node's built-in WebSocket client and the Chrome DevTools Protocol; no browser automation dependencies are required. Defaults are Windows Chrome and `http://127.0.0.1:5173`. Set `CHROME_PATH` or `STORE_URL` to override these. Screenshots are saved under ignored `node_modules/.cache/ozkafe-qa/`. The test cleans up its own isolated browser profile.

## Shopping flow

| Route | Purpose |
| --- | --- |
| `/shop` | Search, collection filters and price/name sorting |
| `/product?id=cb-1` | Packaging/back label, pack size, applicable grind and quantity |
| `/cart` | Edit variants/quantities, remove items, see subtotal and GST |
| `/checkout` | Guest contact details, delivery/pickup, billing, payment preview and review |
| `/confirmation?id=DEMO-...` | A specific demo order summary |
| `/orders` | Demo orders created during the current page session |

The existing `/coffee-beans`, `/commercial`, `/single-origin` and `/instant-coffee` pages link into the same product-selection flow. Existing Vercel and static-host rewrites serve deep links through `index.html`.

### Confirmed checkout choices

- Guest checkout: no account, password or OTP step.
- Delivery throughout India or pickup at the existing Kolkata cafe address.
- Online payment only, representing a future Razorpay checkout.
- Delivery charges are undecided and displayed as **To be confirmed**, never silently treated as free shipping. Delivery totals are labeled **Items total** and exclude shipping. Pickup does not require shipping.
- Catalog prices and the existing 5% GST calculation are retained. No inventory, discounts, delivery dates or serviceability guarantees are fabricated.

Contact name, email and Indian mobile number are required. Delivery also requires recipient name, street address, city, state/UT and a six-digit PIN code. Locality, landmark and order instructions are optional. Customers can provide a separate billing address; pickup customers do not need a delivery address. Validation checks format only, not phone numbers, email ownership or PIN-code serviceability.

## Frontend boundaries

**This is a UI preview, not a live ordering system.** The final action is explicitly labeled **Create demo order** and requires acknowledgement. No order or payment request is sent. No Razorpay SDK, API keys, card fields, UPI credentials, OTP handling or backend endpoints have been added.

The cart is stored in `localStorage` under the existing `ozkafe_cart` key. Stored items are rebuilt from current catalog data; corrupt entries are discarded, and identical variants are merged. Checkout contact/address data and demo order snapshots stay in React memory and are cleared on refresh. Nothing is sent by email, and order previews do not provide live tracking.

## Code structure

- `src/data/coffeeBeansData.js`: existing catalog, sizes, prices, categories and label images.
- `src/data/commerce.js`: cart normalization, variant identity, grind applicability, money formatting and totals.
- `src/data/checkout.js`: checkout shape, state/UT options and step validation.
- `src/components/CommerceUI.jsx`: shared images, quantity controls, links, summaries and empty states.
- `src/pages/Shop.jsx`, `Product.jsx`, `Cart.jsx`, `Checkout.jsx`, `Orders.jsx`: storefront screens.
- `src/commerce.css`: responsive styling using the existing Ozkafe design tokens.
- `src/App.jsx`: navigation, persistent cart and in-memory checkout/order state.
- `src/data/commerce.test.js`: cart recovery, variant merging, totals and checkout validation tests.
- `scripts/check-storefront.mjs`: desktop/mobile browser walkthrough.

Raw artwork archives, source images and duplicate public assets were left intact. Production build output is ignored under `dist/`.

Before live ordering, a later backend phase must own product/stock validation, shipping calculation, authoritative totals, order creation and Razorpay payment verification. It must replace demo history with a real guest-order lookup and provide the store's approved fulfillment, cancellation and privacy terms. This phase intentionally does not implement those services.
