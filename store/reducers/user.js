import {
  LOGGED_IN,
  LOGGED_OUT,
  LOGGING_IN,
  LOGIN_FAILED,
  GETTING_CURRENT_USER,
  GOT_CURRENT_USER,
  GETTING_CURRENT_USER_FAILED,
  RENEWING_ACCESS_TOKEN,
  RENEWING_ACCESS_TOKEN_FAILED,
  RENEWING_ACCESS_TOKEN_SUCCESS,
  UNAUTHENTICATED,
  GETTING_CURRENT_USER_DETAILS,
  GETTING_CURRENT_USER_DETAILS_FAILED,
  GOT_CURRENT_USER_DETAILS,
  UPDATING_CURRENT_USER_DETAILS_SUCCESS,
  UPDATING_CURRENT_USER_DETAILS_FAILURE,
  UPDATING_CURRENT_USER_DETAILS,
  RESETTING_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  UPDATE_PASSWORD_SUCCESS,
  UPDATE_PASSWORD_FAILURE,
  UPDATING_PASSWORD,
  CHANGE_PASSWORD_ONCE,
  REGISTERED_FCM_TOKEN,
  SENDING_FCMTOKEN_SUCCESS,
  DELETING_FCMTOKEN_SUCCESS,
  DELETING_FCMTOKEN,
  SENDING_FCMTOKEN,
} from '../actions/constants';
import { Alert } from 'react-native';

/**
 * Handles the initial Redux store for the user property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of all user related actions
 * This can be the following: Login, Logout, Password reset, Password change, Unauthenticated (no more logged in), Renewing of the authentication JWT, Retreiving customer data
 */

const initialState = {
  isFetching: false,
  isLoggedIn: false,
  userObject: null,
  FCMDeviceToken: null,
  FCMDeviceTokenSaved: false,
  FCMDeviceTokenDelete: false,
  FCMDeviceTokenSending: false,
  details: null,
  accessToken: null,
  expires: null,
  creationDate: null,
  renewReq: null,
};

function user(state = initialState, action) {
  if (action.type === LOGGED_IN) {
    let { access_token, expires_in, reset } = action.user;
    return {
      ...state,
      accessToken: access_token,
      expiresIn: expires_in,
      isLoggedIn: true,
      isFetching: false,
      creationDate: new Date().getTime(),
      reset: reset,
      FCMDeviceTokenSaved: true,
    };
  }
  if (action.type === LOGGING_IN) {
    return {
      ...initialState,
      isFetching: true,
      FCMDeviceToken: state.FCMDeviceToken,
    };
  }
  if (action.type === RESETTING_PASSWORD) {
    return {
      ...state,
      isFetching: true,
    };
  }
  if (
    action.type === RESET_PASSWORD_SUCCESS ||
    action.type === RESET_PASSWORD_FAILURE
  ) {
    return {
      ...state,
      isFetching: false,
    };
  }
  if (action.type === CHANGE_PASSWORD_ONCE) {
    return {
      ...state,
      reset: 'password',
    };
  }
  if (action.type === RENEWING_ACCESS_TOKEN) {
    return {
      ...state,
      isFetching:
        typeof action.showLoading !== typeof undefined && !action.showLoading
          ? false
          : true,
      renewReq: action.renewReq,
    };
  }
  if (action.type === RENEWING_ACCESS_TOKEN_FAILED) {
    if (action.logout) {
      return {
        ...initialState,
        FCMDeviceToken: state.FCMDeviceToken,
      };
    } else {
      return {
        ...state,
        isFetching: false,
        renewReq: null,
      };
    }
  }
  if (action.type === DELETING_FCMTOKEN_SUCCESS) {
    return {
      ...state,
      FCMDeviceTokenSaved: false,
      FCMDeviceTokenDelete: false,
      FCMDeviceTokenSending: false,
    };
  }
  if (action.type === DELETING_FCMTOKEN) {
    return {
      ...state,
      FCMDeviceTokenDelete: true,
      FCMDeviceTokenSending: true,
    };
  }
  if (action.type === SENDING_FCMTOKEN) {
    return {
      ...state,
      FCMDeviceTokenSending: true,
    };
  }
  if (action.type === UNAUTHENTICATED) {
    Alert.alert(
      'Anmeldung',
      'Sie wurden ausgeloggt, weil Sie zu lange inaktiv waren.',
    );
    return {
      ...initialState,
      FCMDeviceToken: state.FCMDeviceToken,
    };
  }
  if (action.type === UPDATE_PASSWORD_SUCCESS) {
    return {
      ...state,
      reset: false,
      isFetching: false,
    };
  }
  if (action.type === UPDATING_PASSWORD) {
    return {
      ...state,
      isFetching: true,
    };
  }
  if (action.type === UPDATE_PASSWORD_FAILURE) {
    return {
      ...state,
      isFetching: false,
    };
  }
  if (action.type === RENEWING_ACCESS_TOKEN_SUCCESS) {
    let { access_token, expires_in } = action.accessToken;
    if (typeof access_token !== typeof undefined && access_token !== null) {
      return {
        ...state,
        accessToken: access_token,
        expiresIn: expires_in,
        isLoggedIn: true,
        isFetching: false,
        creationDate: new Date().getTime(),
        renewReq: null,
      };
    } else {
      return {
        ...state,
        isLoggedIn: true,
        isFetching: false,
        renewReq: null,
      };
    }
  }
  if (action.type === LOGGED_OUT) {
    return {
      ...initialState,
      FCMDeviceToken: state.FCMDeviceToken,
    };
  }
  if (action.type === LOGIN_FAILED) {
    return {
      ...initialState,
      FCMDeviceToken: state.FCMDeviceToken,
    };
  }
  if (action.type === GETTING_CURRENT_USER_FAILED && !action.network) {
    return {
      ...initialState,
      FCMDeviceToken: state.FCMDeviceToken,
    };
  } else {
    if (action.type === GETTING_CURRENT_USER_FAILED) {
      return {
        ...state,
        isFetching: false,
      };
    }
  }
  if (action.type === GETTING_CURRENT_USER) {
    return {
      ...state,
      isFetching:
        typeof action.showLoading !== typeof undefined && !action.showLoading
          ? false
          : true,
    };
  }
  if (action.type === GOT_CURRENT_USER) {
    return {
      ...state,
      userObject: action.user,
      isFetching: false,
      reset: action.user.passwordChangeOnce === 1 ? 'password' : false,
    };
  }
  if (action.type === GETTING_CURRENT_USER_DETAILS) {
    return {
      ...state,
      isFetching: true,
    };
  }
  if (action.type === UPDATING_CURRENT_USER_DETAILS_FAILURE) {
    return {
      ...state,
      isFetching: false,
    };
  }
  if (action.type === UPDATING_CURRENT_USER_DETAILS) {
    return {
      ...state,
      isFetching: true,
    };
  }
  if (
    action.type === GOT_CURRENT_USER_DETAILS ||
    action.type === UPDATING_CURRENT_USER_DETAILS_SUCCESS
  ) {
    return {
      ...state,
      details: action.details,
      isFetching: false,
    };
  }
  if (action.type === GETTING_CURRENT_USER_DETAILS_FAILED) {
    return {
      ...state,
      isFetching: false,
    };
  }
  if (action.type === REGISTERED_FCM_TOKEN) {
    return {
      ...state,
      FCMDeviceToken: action.token,
    };
  }
  if (action.type === SENDING_FCMTOKEN_SUCCESS) {
    return {
      ...state,
      FCMDeviceTokenSaved: true,
      FCMDeviceTokenSending: false,
    };
  }
  return state;
}

module.exports = user;
