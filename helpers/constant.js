export const sepa_payment = require('../assets/img/sepa_payment.png');
export const visa_payment = require('../assets/img/visa_payment.png');
export const master_card_payment = require('../assets/img/master_card_payment.png');
export const paypal_payment = require('../assets/img/paypal_payment.png');

export const options = [
  { label: 'Lastschrift', value: 'Lastschrift', img: [sepa_payment] },
  {
    label: 'Kreditkarte',
    value: 'Kreditkarte',
    img: [visa_payment, master_card_payment],
  },
  { label: 'PayPal', value: 'PayPal', img: [paypal_payment] },
];

export const VehicleList = [
  'Ticket- und Bargeldlos an entsprechenden Parkzonen parken',
  'Ticket-, Bargeld- und Kontaktloses Ein- und Ausfahren in den APAG-Parkobjekten',
];

export const AccountList = [
  'Kontaktloses Ein- und Ausfahren in den APAG-Parkobjekten',
  'Rechnungsbelege Ihrer Park-/ Ladevorgänge',
  'Parktickets für Events buchen',
];

const buttonStyle = {
  borderRadius: 10,
};

export const customerType = [
  { label: 'Privatkunde', value: 'private', style: buttonStyle },
  { label: 'Firmenkunde', value: 'company', style: buttonStyle },
];
