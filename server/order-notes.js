// Razorpay allows 15 note fields, each with at most 256 characters.
// Numbered sections remain plain JSON in the merchant dashboard, not compressed
// blobs. Never drop address fields, product lines or optional instructions.
export function buildOrderNotes(quote) {
  const notes = { schema: 'ozkafe-test-checkout-v1', fulfilment: quote.details.fulfilment };
  const addSection = (name, value) => {
    const serialized = JSON.stringify(value);
    let chunk = '';
    let index = 1;
    const save = () => { notes[`${name}_${String(index++).padStart(2, '0')}`] = chunk; chunk = ''; };
    for (const character of serialized) {
      if (chunk.length + character.length > 256) save();
      chunk += character;
    }
    if (chunk) save();
  };
  addSection('customer', { name: quote.details.name, email: quote.details.email, phone: `+91${quote.details.phone}` });
  if (quote.details.fulfilment === 'delivery') addSection('delivery', quote.details.shipping);
  if (quote.details.separateBilling) addSection('billing', quote.details.billing);
  else notes.billing = quote.details.fulfilment === 'delivery' ? 'Same as delivery address' : 'Not provided';
  addSection('items', quote.items.map(item => ({ id: item.coffeeId, name: item.name, size: item.selectedSize, grind: item.selectedGrind, quantity: item.quantity, unitPrice: item.prices[item.selectedSize] })));
  addSection('totals', { ...quote.totals, currency: quote.currency, gstPercent: 5, deliveryPerKg: 80, coldBrewGramsPerMl: 1 });
  if (quote.details.notes) addSection('instructions', quote.details.notes);
  if (Object.keys(notes).length > 15) throw new Error('This order exceeds Razorpay’s storage limit. Please shorten optional notes or contact Ozkafe to place this order. No payment has been started.');
  return notes;
}
