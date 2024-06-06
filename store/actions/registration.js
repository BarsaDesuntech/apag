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
} from './constants';

export function AddVehicleName(value) {
  return {
    type: ADD_VEHICLE_NAME,
    value,
  };
}

export function AddLicensePlate(value) {
  return {
    type: ADD_LICENSE_PLATE,
    value,
  };
}

export function AddAccountOwner(value) {
  return {
    type: ADD_ACCOUNT_OWNER,
    value,
  };
}

export function AddCardNumber(value) {
  return {
    type: ADD_CARD_NUMBER,
    value,
  };
}

export function AddBic(value) {
  return {
    type: ADD_BIC,
    value,
  };
}

export function UpdateCustomerData(field) {
  return {
    type: ADD_CUSTOMER_DATA,
    field,
  };
}

export function UpdateContactData(field) {
  return {
    type: ADD_CONTACT_DATA,
    field,
  };
}

export function ChangeCustomerType(field) {
  return {
    type: CHANGE_CUSTOMER_TYPE,
    field,
  };
}

export function AddDirectDebit(field) {
  return {
    type: ADD_DIRECT_DEBIT,
    field,
  };
}

export function AddVehicleDetails(field) {
  return {
    type: ADD_VEHICLE_DETAILS,
    field,
  };
}

export function AddCreditCard(field) {
  return {
    type: ADD_CREDIT_CARD,
    field,
  };
}

export function SetPaymentMode(value) {
  return {
    type: SET_PAYMENT_MODE,
    value,
  };
}

export function resetFormDate() {
  return {
    type: RESET_FORM_DATA,
  };
}
