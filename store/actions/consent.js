import {
  SAVING_CONSENT_SETTINGS,
  SAVING_CONSENT_SETTINGS_SUCCESS,
  SAVING_CONSENT_SETTINGS_FAILURE,
} from './constants';

export function savingConsentSettings() {
  return {
    type: SAVING_CONSENT_SETTINGS,
  };
}

export function savingConsentSettingsSuccess(data) {
  return {
    type: SAVING_CONSENT_SETTINGS_SUCCESS,
    consent: data,
  };
}

export function savingConsentSettingsFailure() {
  return {
    type: SAVING_CONSENT_SETTINGS_FAILURE,
  };
}

export function saveConsentSettings(params) {
  return (dispatch, getState) => {
    dispatch(savingConsentSettings());
    const currentState = getState();
    const newState = {
      ...currentState.consent.consent,
      filled: true,
      settings: {
        ...currentState.consent.consent.settings,
        ...params,
      },
    };
    return dispatch(savingConsentSettingsSuccess(newState));
  };
}
