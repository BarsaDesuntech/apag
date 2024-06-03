import {meineapagapi} from '../../env';
import {
  RENEWING_ACCESS_TOKEN,
  RENEWING_ACCESS_TOKEN_SUCCESS,
  RENEWING_ACCESS_TOKEN_FAILED,
} from './constants';

export function renewAccessToken(showLoading = true) {
  return (dispatch, getState) => {
    let currentState = getState();
    let accessToken = false;
    if (
      typeof currentState.user !== typeof undefined &&
      currentState.user.accessToken !== typeof undefined &&
      currentState.user.accessToken !== null
    ) {
      accessToken = currentState.user.accessToken;
    }
    const req = fetch(meineapagapi + 'api/auth/refresh', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        if (
          (typeof responseJson.user !== typeof undefined &&
            typeof responseJson.user.error !== typeof undefined) ||
          typeof responseJson.message !== typeof undefined
        ) {
          if (
            typeof responseJson.message !== typeof undefined &&
            responseJson.message === 'Too Many Attempts.'
          ) {
            return dispatch(renewAccessTokenFailure(false));
          } else {
            return dispatch(renewAccessTokenFailure(true));
          }
        } else {
          return dispatch(renewAccessTokenSuccessful(responseJson));
        }
      })
      .catch(error => {
        if (error.message === 'Network request failed') {
          return dispatch(renewAccessTokenFailure(false));
        }
        return dispatch(renewAccessTokenFailure(true));
      });
    dispatch(renewingAccessToken(req, showLoading));
    return req;
  };
}

export function renewingAccessToken(req, showLoading = true) {
  return {
    type: RENEWING_ACCESS_TOKEN,
    renewReq: req,
    showLoading,
  };
}

export function renewAccessTokenSuccessful(data) {
  return {
    type: RENEWING_ACCESS_TOKEN_SUCCESS,
    accessToken: data,
  };
}

export function renewAccessTokenFailure(toLogout) {
  return {
    type: RENEWING_ACCESS_TOKEN_FAILED,
    logout: toLogout,
  };
}
