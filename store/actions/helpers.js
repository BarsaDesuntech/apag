import { UNAUTHENTICATED, RENEWING_ACCESS_TOKEN_FAILED } from './constants';
import { renewAccessToken } from './token';

export function handleAuth(data, dispatch, getState, showLoading = true) {
  return new Promise((resolve, reject) => {
    if (
      typeof data.message !== typeof undefined &&
      (data.message === 'Unauthenticated.' ||
        data.message === 'An error occurred' ||
        data.message === 'The token has been blacklisted')
    ) {
      let currentState = getState();
      let accessToken = false;
      let renewReq = null;
      if (
        typeof currentState.user !== typeof undefined &&
        currentState.user.accessToken !== typeof undefined &&
        currentState.user.accessToken !== null
      ) {
        accessToken = currentState.user.accessToken;
      }
      if (
        typeof currentState.user !== typeof undefined &&
        currentState.user.renewReq !== typeof undefined &&
        currentState.user.renewReq !== null
      ) {
        renewReq = currentState.user.renewReq;
      }
      if (accessToken) {
        if (isPromise(renewReq)) {
          return renewReq.then(res => {
            if (res.type === RENEWING_ACCESS_TOKEN_FAILED) {
              if (res.logout) {
                dispatch({
                  type: UNAUTHENTICATED,
                });
              }
              return reject(false);
            } else {
              return resolve(true);
            }
          });
        } else {
          return dispatch(renewAccessToken(showLoading)).then(res => {
            if (res.type === RENEWING_ACCESS_TOKEN_FAILED) {
              if (res.logout) {
                dispatch({
                  type: UNAUTHENTICATED,
                });
              }
              return reject(false);
            } else {
              return resolve(true);
            }
          });
        }
      } else {
        return reject(false);
      }
    } else {
      if (
        typeof data.message !== typeof undefined &&
        data.message === 'Too Many Attempts.'
      ) {
        return reject({ message: data.message });
      }
      if (typeof data.reset !== typeof undefined && data.reset === 'password') {
        return reject({ reset: 'password' });
      }
      return resolve(true);
    }
  });
}
function isPromise(obj) {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  );
}
export function getAuthToken(dispatch, getState, showLoading) {
  return new Promise((resolve, reject) => {
    let currentState = getState();
    let accessToken = false;
    let renewReq = null;
    if (
      typeof currentState.user !== typeof undefined &&
      currentState.user.accessToken !== typeof undefined &&
      currentState.user.accessToken !== null
    ) {
      accessToken = currentState.user.accessToken;
    }
    if (
      typeof currentState.user !== typeof undefined &&
      currentState.user.renewReq !== typeof undefined &&
      currentState.user.renewReq !== null
    ) {
      renewReq = currentState.user.renewReq;
    }
    if (accessToken) {
      let currentDate = new Date().getTime();
      let compareDate =
        new Date(
          currentState.user.creationDate + currentState.user.expiresIn * 1000,
        ).getTime() - 5000;
      if (currentDate >= compareDate) {
        if (isPromise(renewReq)) {
          return renewReq.then(res => {
            if (res.type === RENEWING_ACCESS_TOKEN_FAILED) {
              return reject({
                error: 'Could not retrieve JWT.',
                logout: res.logout,
              });
            } else {
              return resolve(res.accessToken.access_token);
            }
          });
        } else {
          return dispatch(renewAccessToken(showLoading)).then(res => {
            if (res.type === RENEWING_ACCESS_TOKEN_FAILED) {
              return reject({
                error: 'Could not retrieve JWT.',
                logout: res.logout,
              });
            } else {
              return resolve(res.accessToken.access_token);
            }
          });
        }
      } else {
        return resolve(accessToken);
      }
    } else {
      return reject(true);
    }
  });
}
