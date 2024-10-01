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
export const mapStyleNormal = [
  {
    featureType: 'administrative',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#bdbdbd',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#878c8c',
      },
    ],
  },
];
export const mapStyleReduced = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#eff3fb',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#bdbdbd',
      },
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
];
