// Dependency-free Chrome smoke test. Run a local Vite server first.
// CHROME_PATH and STORE_URL can override the Windows Chrome/default Vite paths.
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import assert from 'node:assert/strict';
import { createPaymentService } from '../server/payment-service.js';
import { providerFixture, testEnv } from '../server/payment-fixture.js';

const origin = process.env.STORE_URL || 'http://127.0.0.1:5173';
const out = resolve('node_modules/.cache/ozkafe-qa');
await mkdir(out, { recursive: true });
const profile = await mkdtemp(join(out, 'profile-'));
const chrome = spawn(process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--no-default-browser-check', '--remote-debugging-port=0',
  '--remote-debugging-address=127.0.0.1', `--user-data-dir=${profile}`, 'about:blank'
], { windowsHide: true, stdio: 'ignore', env: { ...process.env, TEMP: profile, TMP: profile } });
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let ws;
try {
  let target;
  for (let i = 0; i < 60; i++) {
    try { const port = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]; target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find(item => item.type === 'page'); } catch {}
    if (target) break;
    await delay(250);
  }
  assert.ok(target, 'Chrome debugging endpoint must start');
  ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener('open', resolve, { once: true }); ws.addEventListener('error', reject, { once: true }); });
  let sequence = 0;
  const pending = new Map();
  const errors = [];
  ws.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject, timer } = pending.get(message.id); clearTimeout(timer); pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
    }
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text + ' ' + message.params.exceptionDetails.exception?.description);
  });
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error(`Timeout: ${method}`)); }, 15000);
    pending.set(id, { resolve, reject, timer }); ws.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async expression => {
    const result = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || 'Evaluation failed');
    return result.result.value;
  };
  const until = async expression => {
    for (let i = 0; i < 80; i++) { if (await evaluate(`Boolean(${expression})`)) return; await delay(150); }
    throw new Error(`Condition not reached: ${expression}`);
  };
  const click = async selector => {
    await until(`Boolean(document.querySelector(${JSON.stringify(selector)}))`);
    await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await delay(150);
  };
  const button = async text => {
    const expression = `[...document.querySelectorAll('button')].find(el => el.textContent.trim() === ${JSON.stringify(text)})`;
    await until(`Boolean(${expression})`); await evaluate(`${expression}.click()`); await delay(150);
  };
  const fill = async (id, value) => {
    await evaluate(`(() => {const el = document.getElementById(${JSON.stringify(id)}); const proto = el.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype; Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, ${JSON.stringify(value)}); el.dispatchEvent(new Event('input', {bubbles:true})); el.dispatchEvent(new Event('change', {bubbles:true}));})()`); await delay(60);
  };
  const goto = async path => {
    const navigation = await call('Page.navigate', { url: origin + path });
    if (navigation.errorText) throw new Error(`Navigation failed for ${path}: ${navigation.errorText}`);
    try { await until(`Boolean(document.querySelector('.store-page, .coffee-beans-page'))`); }
    catch (error) { throw new Error(`${path}: ${error.message}\nBrowser errors: ${errors.join('\n')}\nPage: ${await evaluate('document.body.innerText.slice(0, 1000)')}`); }
    await delay(500);
  };
  const shot = async name => { await evaluate('document.fonts.ready'); await delay(400); const { data } = await call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false }); await writeFile(join(out, `${name}.png`), Buffer.from(data, 'base64')); };
  const viewport = async width => { await call('Emulation.setDeviceMetricsOverride', { width, height: 950, deviceScaleFactor: 1, mobile: false }); await delay(200); };
  const noOverflow = async label => {
    const bad = await evaluate(`document.documentElement.scrollWidth > innerWidth`);
    assert.equal(bad, false, `${label}: page must not overflow horizontally`);
  };
  const navigateInApp = async path => {
    await evaluate(`(() => { history.pushState({}, '', ${JSON.stringify(path)}); window.dispatchEvent(new PopStateEvent('popstate')); })()`);
    await delay(250);
    await until(`Boolean(document.querySelector('.store-page, .coffee-beans-page'))`);
  };
  const checkTotal = async expected => assert.equal(await evaluate(`document.querySelector('.store-total dd').textContent`), expected);
  await call('Runtime.enable'); await call('Page.enable');
  // Intercept only in this isolated QA browser. No test hooks ship in the app.
  const provider = providerFixture();
  const service = createPaymentService({ env: testEnv, fetchImpl: provider.fetchImpl });
  let enabled = true;
  await call('Fetch.enable', { patterns: [{ urlPattern: `${origin}/api/payments*` }] });
  await call('Runtime.addBinding', { name: '__qaOpen' });
  ws.addEventListener('message', async event => {
    const message = JSON.parse(event.data);
    try {
      if (message.method === 'Fetch.requestPaused') {
        const { requestId, request } = message.params;
        let responseCode = 200; let body;
        try {
          if (request.method === 'GET') body = { enabled, mode: 'test' };
          else { const input = JSON.parse(request.postData); body = await service[input.action](input); }
        } catch (error) { responseCode = error.status || 500; body = { error: error.message }; }
        await call('Fetch.fulfillRequest', { requestId, responseCode, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }], body: Buffer.from(JSON.stringify(body)).toString('base64') });
      }
      if (message.method === 'Runtime.bindingCalled' && message.params.name === '__qaOpen') {
        const { orderId, mode } = JSON.parse(message.params.payload);
        if (mode === 'cancel') await evaluate('window.__qaWidget.options.modal.ondismiss()');
        else if (mode === 'lost-callback') {
          provider.authorize(orderId, { status: 'captured', captured: true });
          await evaluate('window.__qaWidget.options.modal.ondismiss()');
        } else {
          const callback = mode === 'forged' ? { razorpay_order_id: orderId, razorpay_payment_id: 'pay_forged', razorpay_signature: '0'.repeat(64) } : provider.authorize(orderId);
          await evaluate(`window.__qaWidget.options.handler(${JSON.stringify(callback)})`);
        }
      }
    } catch (error) { errors.push(`Payment test interception: ${error.message}`); }
  });
  await call('Page.addScriptToEvaluateOnNewDocument', { source: `window.Razorpay = class { constructor(options) { this.options = options; window.__qaWidget = this; } on() {} open() { window.__qaOpen(JSON.stringify({ orderId: this.options.order_id, mode: window.__qaPaymentMode || 'success' })); } };` });
  await viewport(1440);
  await goto('/shop');
  await until(`location.pathname === '/coffee-beans'`);
  assert.equal(await evaluate(`document.querySelectorAll('a[href="/shop"]').length`), 0, 'Extra Shop Coffee page has no remaining navigation links');
  await until(`document.querySelectorAll('.shelf-coffee-card').length === 60`);
  await shot('catalog-desktop'); await noOverflow('Desktop catalog');
  await evaluate(`(() => { const el = document.querySelector('.beans-search-input'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el,'no-such-coffee'); el.dispatchEvent(new Event('input',{bubbles:true})); })()`);
  await until(`document.querySelector('.beans-empty-state')?.textContent.includes('No coffees found')`);
  await button('Clear Search & View All 60 Coffees');
  await click('button[aria-label="Choose options for Cowboy Blend"]');
  await until(`document.querySelector('.store-product-info h1')?.textContent === 'Cowboy Blend'`);
  await evaluate('history.back()'); await until(`location.pathname === '/coffee-beans' && document.querySelector('.shelf-coffee-card')`);
  await evaluate('history.forward()'); await until(`location.pathname === '/product' && document.querySelector('.store-product-info')`);
  await click('input[name=size][value="250g"]');
  await button('Add to cart');
  await button('Add another');
  await click('.nav-cart-btn');
  await until(`document.querySelector('.store-quantity output')?.textContent === '2'`);
  await checkTotal('₹516.60');
  await goto('/cart');
  assert.equal(await evaluate(`document.querySelector('.store-quantity output').textContent`), '2', 'Cart survives refresh');
  await click('button[aria-label="Increase quantity for Cowboy Blend"]');
  assert.equal(await evaluate(`document.querySelector('.store-quantity output').textContent`), '3');
  await checkTotal('₹774.90');
  await click('button[aria-label="Decrease quantity for Cowboy Blend"]');
  await shot('cart-desktop');
  await viewport(390); await noOverflow('Mobile cart'); await shot('cart-mobile'); await viewport(1440);
  await click('a[href="/checkout"]');
  await button('Continue to delivery');
  assert.equal(await evaluate('document.querySelectorAll(".store-field [aria-invalid=true]").length'), 3, 'Empty contact form blocked');
  await fill('name', 'Test Customer'); await fill('email', 'test@example.com'); await fill('phone', '9876543210');
  await button('Continue to delivery');
  await click('input[value=delivery]');
  await checkTotal('₹516.60');
  await click('input[value=pickup]'); await checkTotal('₹474.60');
  await click('input[value=delivery]'); await checkTotal('₹516.60');
  await button('Review order');
  assert.ok(await evaluate('Boolean(document.querySelector(".store-error-summary"))'), 'Empty address blocked');
  for (const [key, value] of Object.entries({ name: 'Test Customer', line1: '12 Test Street', city: 'Kolkata', state: 'West Bengal', pin: '700019' })) await fill(`shipping.${key}`, value);
  await click('.store-check input');
  for (const [key, value] of Object.entries({ name: 'Billing Customer', line1: '42 Billing Street', city: 'Mumbai', state: 'Maharashtra', pin: '400001' })) await fill(`billing.${key}`, value);
  await viewport(390); await shot('checkout-mobile'); await noOverflow('Mobile address form');
  await button('Review order'); await click('#payment'); await click('#acknowledged');
  assert.ok(await evaluate(`document.querySelector('form').textContent.includes('42 Billing Street')`), 'Separate billing address appears in review');
  await viewport(1440); await shot('review-desktop');
  await evaluate("window.__qaPaymentMode = 'cancel'");
  await button('Pay with Razorpay (test)');
  await until(`document.body.textContent.includes('Checkout was closed')`);
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem('ozkafe_cart'))[0].quantity`), 2, 'Cancelled payment preserves cart');
  assert.ok(await evaluate(`Boolean(sessionStorage.getItem('ozkafe_test_payment'))`));
  await evaluate("window.__qaPaymentMode = 'forged'");
  await button('Pay with Razorpay (test)');
  await until(`document.body.textContent.includes('signature could not be verified')`);
  assert.equal(await evaluate('location.pathname'), '/checkout', 'Forged payment cannot show success');
  await goto('/checkout');
  await button('Check payment status / restore');
  await until(`document.body.textContent.includes('saved checkout has been restored')`);
  assert.ok(await evaluate(`document.querySelector('form').textContent.includes('42 Billing Street')`));
  await viewport(320); await noOverflow('Payment recovery 320px'); await shot('payment-recovery-mobile');
  await viewport(1440);
  await button('Pay with Razorpay (test)');
  await until(`location.pathname === '/confirmation'`);
  await checkTotal('₹516.60');
  assert.ok(await evaluate(`document.body.textContent.includes('Your test payment is confirmed.')`));
  assert.equal(provider.orders.size, 1, 'Payment retries reuse one provider order');
  assert.equal(await evaluate(`JSON.parse(localStorage.getItem('ozkafe_cart')).length`), 0);
  assert.equal(await evaluate(`localStorage.getItem('ozkafe_cart').includes('test@example.com')`), false);
  await shot('confirmation-desktop');
  await click('a[href="/orders"]');
  assert.equal(await evaluate('document.querySelectorAll(".store-order-card").length'), 1);
  assert.ok(await evaluate(`document.querySelector('.store-order-card').textContent.includes('₹516.60')`), 'Order history includes delivery and GST');
  await click('.store-order-card a');
  await until(`document.querySelector('.store-confirm-hero')`);
  await goto('/product?id=cb-57');
  assert.equal(await evaluate(`document.querySelectorAll('input[name=grind]').length`), 0);
  await button('Buy now');
  await fill('name', 'Pickup Customer'); await fill('email', 'pickup@example.com'); await fill('phone', '9876543210');
  await button('Continue to delivery');
  await click('input[value=delivery]'); await checkTotal('₹455.07');
  await click('input[value=pickup]'); await checkTotal('₹439.95');
  assert.equal(await evaluate(`document.querySelectorAll('input[id^="shipping."]').length`), 0);
  await button('Review order'); await click('#payment'); await click('#acknowledged');
  await evaluate("window.__qaPaymentMode = 'lost-callback'");
  await button('Pay with Razorpay (test)');
  await until(`document.body.textContent.includes('Checkout was closed')`);
  await goto('/checkout');
  await button('Check payment status / restore');
  await until(`location.pathname === '/confirmation'`);
  assert.ok(await evaluate(`document.querySelector('.store-totals').textContent.includes('Not applicable (pickup)')`));
  await checkTotal('₹439.95');
  await goto('/product?id=cb-1'); await button('Add to cart');
  for (const width of [320, 390, 768, 1024, 1041, 1280, 1440]) {
    await viewport(width);
    for (const path of ['/coffee-beans', '/commercial', '/single-origin', '/instant-coffee', '/product?id=cb-1', '/cart', '/checkout']) {
      await navigateInApp(path); await noOverflow(`${path} ${width}`);
      assert.equal(await evaluate(`document.querySelectorAll('a[href="/shop"]').length`), 0);
    }
    if (width > 1040) assert.ok(await evaluate(`(() => { const brand = document.querySelector('.nav-brand').getBoundingClientRect(); const links = document.querySelector('.nav-links').getBoundingClientRect(); const actions = document.querySelector('.nav-actions').getBoundingClientRect(); return brand.right <= links.left && links.right <= actions.left; })()`), `Header items must not overlap at ${width}px`);
  }
  await viewport(390); await goto('/coffee-beans'); await shot('catalog-mobile');
  await click('.mobile-toggle');
  assert.equal(await evaluate(`document.querySelector('#mobile-nav-drawer').textContent.includes('Shop Coffee')`), false);
  assert.equal(await evaluate(`document.activeElement.getAttribute('aria-label')`), 'Close navigation');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 });
  assert.ok(await evaluate(`document.querySelector('#mobile-nav-drawer').contains(document.activeElement)`), 'Focus stays in mobile drawer');
  await call('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
  await until(`!document.querySelector('#mobile-nav-drawer')`);
  await click('.mobile-toggle');
  await click('#mobile-nav-drawer a[href="/commercial"]');
  await until(`!document.querySelector('#mobile-nav-drawer')`);
  await goto('/product?id=does-not-exist');
  assert.ok(await evaluate(`document.body.textContent.includes('Coffee not found')`));
  await goto('/confirmation?id=missing');
  assert.ok(await evaluate(`document.body.textContent.includes('No test receipt to show')`));
  enabled = false;
  await goto('/checkout');
  await until(`document.body.textContent.includes('Test payments are currently unavailable')`);
  await goto('/cart');
  await evaluate(`localStorage.setItem('ozkafe_cart','{"bad":true}')`);
  await goto('/cart');
  assert.ok(await evaluate(`document.body.textContent.includes('Your next cup is waiting')`));
  assert.deepEqual(errors, [], 'No browser runtime errors');
  console.log('PASS: catalogue, cart, delivery/GST, pickup, payment cancellation, forged callbacks, retry reuse, refresh recovery, verified test orders, unavailable gateway, mobile navigation and responsive widths 320–1440px. Payment provider and SDK are mocked; real payment-service validation runs.');
  console.log(`Screenshots: ${out}`);
  await call('Browser.close').catch(() => {});
} finally {
  ws?.close(); chrome.kill();
  // Only remove the unique profile created by this test, inside its verified QA folder.
  if (dirname(resolve(profile)) === out && profile.startsWith(join(out, 'profile-'))) {
    await delay(500);
    await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 }).catch(() => {});
  }
}
