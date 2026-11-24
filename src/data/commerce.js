import { COFFEE_BEANS_DATA, GRIND_SIZE_OPTIONS } from './coffeeBeansData.js';

export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
export const supportsGrind = product => !['instant-coffee', 'flavoured-instant', 'cold-brew'].includes(product.categoryId) && !/cascara/i.test(product.name);
export const defaultSize = product => Object.keys(product.prices)[0];
export const productById = id => COFFEE_BEANS_DATA.find(product => product.id === id);
export const variantKey = (id, size, grind) => `${id}|${size}|${grind}`;
export const DELIVERY_RATE_PER_KG = 80;

// Billing rules confirmed by the store owner: proportional weight, including
// 1ml = 1g for cold brew. No rounding up to whole kilograms.
export function packWeightGrams(size) {
  const match = /^(\d+(?:\.\d+)?)\s*(kg|g|ml)$/i.exec(size.trim());
  if (!match || Number(match[1]) <= 0) throw new Error(`Missing delivery weight for pack size: ${size}`);
  return Number(match[1]) * (match[2].toLowerCase() === 'kg' ? 1000 : 1);
}

export const itemDeliveryPaise = item => Math.round(packWeightGrams(item.selectedSize) * DELIVERY_RATE_PER_KG / 10) * item.quantity;

export function collectionPage(product) {
  if (['commercial-blends', 'south-indian-filter'].includes(product.categoryId)) return 'commercial';
  if (['instant-coffee', 'flavoured-instant', 'cold-brew'].includes(product.categoryId)) return 'instant-coffee';
  return 'single-origin';
}

// Use current catalog data rather than trusting prices in browser storage.
export function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value.reduce((items, row) => {
    const product = productById(row?.coffeeId);
    if (!product || !Number.isSafeInteger(row.quantity) || row.quantity < 1) return items;
    const size = Object.hasOwn(product.prices, row.selectedSize) ? row.selectedSize : defaultSize(product);
    const grind = supportsGrind(product) ? (GRIND_SIZE_OPTIONS.includes(row.selectedGrind) ? row.selectedGrind : 'Whole Beans') : '';
    const id = variantKey(product.id, size, grind);
    const existing = items.find(item => item.id === id);
    if (existing) {
      if (Number.isSafeInteger(existing.quantity + row.quantity)) existing.quantity += row.quantity;
    } else items.push({ ...product, coffeeId: product.id, id, selectedSize: size, selectedGrind: grind, quantity: row.quantity });
    return items;
  }, []);
}

export function cartTotals(cart, fulfilment = 'delivery') {
  const subtotalPaise = cart.reduce((sum, item) => sum + Math.round(item.prices[item.selectedSize] * 100) * item.quantity, 0);
  const deliveryPaise = fulfilment === 'pickup' ? 0 : cart.reduce((sum, item) => sum + itemDeliveryPaise(item), 0);
  // The owner specifies 5% GST on the full bill, including delivery.
  const taxPaise = Math.round((subtotalPaise + deliveryPaise) * 0.05);
  return {
    subtotal: subtotalPaise / 100,
    delivery: deliveryPaise / 100,
    tax: taxPaise / 100,
    total: (subtotalPaise + deliveryPaise + taxPaise) / 100,
    count: cart.reduce((sum, item) => sum + item.quantity, 0),
    weightGrams: cart.reduce((sum, item) => sum + packWeightGrams(item.selectedSize) * item.quantity, 0)
  };
}
