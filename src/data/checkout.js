export const INDIA_STATES = [
  'Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
  'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export const emptyAddress = () => ({ name: '', line1: '', line2: '', landmark: '', city: '', state: '', pin: '', country: 'India' });
export const newCheckout = () => ({ name: '', email: '', phone: '', fulfilment: '', shipping: emptyAddress(), separateBilling: false, billing: emptyAddress(), notes: '', payment: '', acknowledged: false });

export function validateCheckout(draft, step) {
  const errors = {};
  if (step === 0 || step === undefined) {
    if (draft.name.trim().length < 2) errors.name = 'Enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) errors.email = 'Enter a valid email address.';
    if (!/^[6-9]\d{9}$/.test(draft.phone.replace(/\s/g, ''))) errors.phone = 'Enter a valid 10-digit Indian mobile number, without +91.';
  }
  if (step === 1 || step === undefined) {
    if (!['delivery', 'pickup'].includes(draft.fulfilment)) errors.fulfilment = 'Choose home delivery or café pickup.';
    const checkAddress = (address, prefix) => {
      if (address.name.trim().length < 2) errors[`${prefix}.name`] = 'Enter the recipient’s full name.';
      if (address.line1.trim().length < 5) errors[`${prefix}.line1`] = 'Enter a house / flat number and street address.';
      if (address.city.trim().length < 2) errors[`${prefix}.city`] = 'Enter a city or town.';
      if (!INDIA_STATES.includes(address.state)) errors[`${prefix}.state`] = 'Select a state or union territory.';
      if (!/^[1-9]\d{5}$/.test(address.pin.trim())) errors[`${prefix}.pin`] = 'Enter a valid 6-digit PIN code.';
    };
    if (draft.fulfilment === 'delivery') checkAddress(draft.shipping, 'shipping');
    if (draft.separateBilling) checkAddress(draft.billing, 'billing');
  }
  if (step === 2 || step === undefined) {
    if (draft.payment !== 'online') errors.payment = 'Select online payment to continue.';
    if (!draft.acknowledged) errors.acknowledged = 'Confirm that you understand this is a test payment.';
  }
  return errors;
}
