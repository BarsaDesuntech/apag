import {
  SAVING_CONSENT_SETTINGS,
  SAVING_CONSENT_SETTINGS_SUCCESS,
  SAVING_CONSENT_SETTINGS_FAILURE,
} from '../actions/constants';

/**
 * Handles the initial Redux store for the rabatt property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the request QR-Code data
 */

const initialState = {
  consent: {
    filled: false,
    settings: {
      bugsnag: false,
      maps: false,
      push: false,
    },
  },
  isSaving: false,
  error: false,
};

function consent(state = initialState, action) {
  switch (action.type) {
    case SAVING_CONSENT_SETTINGS:
      return {
        ...state,
        isSaving: true,
      };
    case SAVING_CONSENT_SETTINGS_SUCCESS:
      return {
        ...state,
        isSaving: false,
        error: false,
        consent: action.consent,
      };
    case SAVING_CONSENT_SETTINGS_FAILURE:
      return {
        ...state,
        isSaving: false,
        error: true,
      };
    default:
      return state;
  }
}

module.exports = consent;
