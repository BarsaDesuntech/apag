import {
  ADD_ACCOUNT_OWNER,
  ADD_CUSTOMER_DATA,
  ADD_BIC,
  ADD_CARD_NUMBER,
  ADD_CREDIT_CARD,
  ADD_DIRECT_DEBIT,
  ADD_LICENSE_PLATE,
  ADD_VEHICLE_DETAILS,
  ADD_VEHICLE_NAME,
  RESET_FORM_DATA,
  SET_PAYMENT_MODE,
  ADD_CONTACT_DATA,
  CHANGE_CUSTOMER_TYPE,
} from '../actions/constants';

/**
 * Handles the initial Redux store for the rabatt property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the request QR-Code data
 */

const initialState = {
  private: {
    contact: {
      Geburtsdatum: '',
      Telefon1: '',
    },
    customer: {
      Anrede: '',
      Name1: '',
      Name2: '',
      Ort: '',
      Land: '',
      PLZ: '',
      Strasse: '',
    },
  },
  company: {
    contact: {
      contact_person_anrede: '',
      contact_person_firstname: '',
      contact_person_surname: '',
      phone: '',
    },
    customer: {
      Anrede: 'Firma',
      Telefon1: '',
      Name1: '',
      Name2: '',
      PLZ: '',
      Ort: '',
      Land: '',
      Strasse: '',
    },
  },
  type: 'private',
  directDebit: {
    Zahlart: 'SEPA-Basislastschrift (CORE)',
    IBAN: '',
    BIC: '',
    allow: false,
  },
  creditCard: {
    cardholders: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
  },
  vehicleDetails: {
    licensePlate: '',
    vehicleName: '',
    activateLicense: false,
  },
  paymentMode: '',
};

function registration(state = initialState, action) {
  switch (action.type) {
    case ADD_VEHICLE_NAME:
      return {
        ...state,
        vehicleName: action.value,
      };
    case ADD_LICENSE_PLATE:
      return {
        ...state,
        licensePlate: action.value,
      };
    case ADD_ACCOUNT_OWNER:
      return {
        ...state,
        accountOwner: action.value,
      };
    case ADD_CARD_NUMBER:
      return {
        ...state,
        cardNumber: action.value,
      };
    case ADD_BIC:
      return {
        ...state,
        bic: action.value,
      };
    case SET_PAYMENT_MODE:
      return {
        ...state,
        paymentMode: action.value,
      };
    case ADD_CUSTOMER_DATA:
      return {
        ...state,
        [state.type]: {
          ...state[state.type],
          customer: {
            ...state[state.type].customer,
            [action.field.name]: action.field.value,
          },
        },
      };
    case ADD_CONTACT_DATA:
      return {
        ...state,
        [state.type]: {
          ...state[state.type],
          contact: {
            ...state[state.type].contact,
            [action.field.name]: action.field.value,
          },
        },
      };
    case ADD_DIRECT_DEBIT:
      return {
        ...state,
        directDebit: {
          ...state.directDebit,
          [action.field.name]: action.field.value,
        },
      };
    case ADD_CREDIT_CARD:
      return {
        ...state,
        creditCard: {
          ...state.creditCard,
          [action.field.name]: action.field.value,
        },
      };
    case ADD_VEHICLE_DETAILS:
      return {
        ...state,
        vehicleDetails: {
          ...state.vehicleDetails,
          [action.field.name]: action.field.value,
        },
      };
    case CHANGE_CUSTOMER_TYPE:
      return {
        ...state,
        type: action.field,
      };
    case RESET_FORM_DATA:
      return {
        ...initialState,
      };
    default:
      return state;
  }
}

module.exports = registration;
