import { COFFEE_BEANS_DATA, GRIND_SIZE_OPTIONS } from './coffeeBeansData.js';

export const money = value => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
export const supportsGrind = product => !['instant-coffee', 'flavoured-instant', 'cold-brew'].includes(product.categoryId) && !/cascara/i.test(product.name);
export const defaultSize = product => Object.keys(product.prices)[0];
export const productById = id => COFFEE_BEANS_DATA.find(product => product.id === id);
export const variantKey = (id, size, grind) => `${id}|${size}|${grind}`;

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

export function cartTotals(cart) {
  const subtotalPaise = cart.reduce((sum, item) => sum + Math.round(item.prices[item.selectedSize] * 100) * item.quantity, 0);
  // Preserve the 5% GST specified in the existing repository catalog.
  const taxPaise = Math.round(subtotalPaise * 0.05);
  return { subtotal: subtotalPaise / 100, tax: taxPaise / 100, total: (subtotalPaise + taxPaise) / 100, count: cart.reduce((sum, item) => sum + item.quantity, 0) };
}
