import {
  LOGGING_IN,
  LOGGED_IN,
  LOGGED_OUT,
  LOGIN_FAILED,
  GETTING_CURRENT_USER,
  GETTING_CURRENT_USER_FAILED,
  GOT_CURRENT_USER,
  GETTING_CURRENT_USER_DETAILS,
  GOT_CURRENT_USER_DETAILS,
  GETTING_CURRENT_USER_DETAILS_FAILED,
  UPDATING_CURRENT_USER_DETAILS,
  UPDATING_CURRENT_USER_DETAILS_FAILURE,
  UPDATING_CURRENT_USER_DETAILS_SUCCESS,
  UNAUTHENTICATED,
  RESETTING_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_FAILURE,
  UPDATE_PASSWORD_FAILURE,
  UPDATE_PASSWORD_SUCCESS,
  UPDATING_PASSWORD,
  CHANGE_PASSWORD_ONCE,
  REGISTERED_FCM_TOKEN,
  SENDING_FCMTOKEN,
  SENDING_FCMTOKEN_FAILURE,
  SENDING_FCMTOKEN_SUCCESS,
  DELETING_FCMTOKEN,
  DELETING_FCMTOKEN_FAILURE,
  DELETING_FCMTOKEN_SUCCESS,
} from './constants';
import { handleAuth, getAuthToken } from './helpers';
import { meineapagapi } from '../../env';

// While logging in
export function logging_in() {
  return {
    type: LOGGING_IN,
  };
}

// After successfully logged in
export function loginSuccess(data) {
  return {
    type: LOGGED_IN,
    user: data,
  };
}

// After login has failed
export function loginFailure(network, throttle, response) {
  return {
    type: LOGIN_FAILED,
    network,
    throttle,
    response,
  };
}

// Initiate login - send API request
export function login(params) {
  return (dispatch, getState) => {
    // Get current state from store
    const currentState = getState();
    // Store loading state
    dispatch(logging_in());
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (
      typeof currentState.user.FCMDeviceToken !== typeof undefined &&
      currentState.user.FCMDeviceToken !== false &&
      currentState.user.FCMDeviceToken !== null &&
      currentState.consent.consent.settings.push
    ) {
      headers['FCM-Token'] = currentState.user.FCMDeviceToken;
    }
    // Send API request including login information
    return fetch(meineapagapi + 'api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Check if there have been any errors
        if (
          typeof responseJson.error !== typeof undefined ||
          (typeof responseJson.user !== typeof undefined &&
            typeof responseJson.user.error !== typeof undefined) ||
          typeof responseJson.access_token === typeof undefined
        ) {
          // Differentiate between login error to show special error messages to the user
          if (
            typeof responseJson.message !== typeof undefined &&
            responseJson.message === 'The given data was invalid.' &&
            typeof responseJson.errors !== typeof undefined &&
            typeof responseJson.errors.email !== typeof undefined &&
            responseJson.errors.email[0].indexOf('Zu viele Login-Versuche') !==
              -1
          ) {
            return dispatch(loginFailure(false, true, responseJson));
          } else {
            return dispatch(loginFailure(false, false, responseJson));
          }
        } else {
          // Continue if there have been no issues and the login was successful
          return dispatch(loginSuccess(responseJson));
        }
      })
      .catch(error => {
        if (error.message === 'Network request failed') {
          return dispatch(loginFailure(true, false));
        }
        return dispatch(loginFailure(false, false));
      });
  };
}

// Initiate login - send API request
export function checkVerified(params) {
  return (dispatch, getState) => {
    // Get current state from store
    const currentState = getState();
    // Store loading state
    dispatch(logging_in());
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    if (
      typeof currentState.user.FCMDeviceToken !== typeof undefined &&
      currentState.user.FCMDeviceToken !== false &&
      currentState.user.FCMDeviceToken !== null &&
      currentState.consent.consent.settings.push
    ) {
      headers['FCM-Token'] = currentState.user.FCMDeviceToken;
    }

    // Send API request including login information
    return fetch(
      meineapagapi + 'api/register/email/check_verified/' + params.token,
      {
        method: 'GET',
        credentials: 'include',
        headers,
      },
    )
      .then(response => response.json())
      .then(responseJson => {
        console.log(responseJson);
        // Check if there have been any errors
        if (
          typeof responseJson.error !== typeof undefined ||
          (typeof responseJson.user !== typeof undefined &&
            typeof responseJson.user.error !== typeof undefined) ||
          typeof responseJson.access_token === typeof undefined
        ) {
          // Differentiate between login error to show special error messages to the user
          if (
            typeof responseJson.message !== typeof undefined &&
            responseJson.message === 'The given data was invalid.' &&
            typeof responseJson.errors !== typeof undefined &&
            typeof responseJson.errors.email !== typeof undefined &&
            responseJson.errors.email[0].indexOf('Zu viele Login-Versuche') !==
              -1
          ) {
            return dispatch(loginFailure(false, true, responseJson));
          } else {
            return dispatch(loginFailure(false, false, responseJson));
          }
        } else {
          // Used to navigate to next screen
          params.next();
          // Continue if there have been no issues and the login was successful
          return dispatch(loginSuccess(responseJson));
        }
      })
      .catch(error => {
        if (error.message === 'Network request failed') {
          return dispatch(loginFailure(true, false));
        }
        return dispatch(loginFailure(false, false));
      });
  };
}

// Initiate login - send API request
export function register(params) {
  return (dispatch, getState) => {
    // Store loading state
    dispatch(logging_in());
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };
    // Send API request including login information
    return fetch(meineapagapi + 'api/register/user', {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Check if there have been any errors
        if (typeof responseJson.error !== typeof undefined) {
          // Differentiate between login error to show special error messages to the user
          if (
            typeof responseJson.message !== typeof undefined &&
            responseJson.message === 'The given data was invalid.' &&
            typeof responseJson.errors !== typeof undefined &&
            typeof responseJson.errors.email !== typeof undefined &&
            responseJson.errors.email[0].indexOf('Zu viele Login-Versuche') !==
              -1
          ) {
            return dispatch(loginFailure(false, true, responseJson));
          } else {
            return dispatch(loginFailure(false, false, responseJson));
          }
        } else {
          // Continue if there have been no issues and the login was successful
          return dispatch(loginSuccess(responseJson));
        }
      })
      .catch(error => {
        if (error.message === 'Network request failed') {
          return dispatch(loginFailure(true, false));
        }
        return dispatch(loginFailure(false, false));
      });
  };
}

// Unused function which sends a request to the Meine APAG API logging the user in by using the Nupsi/MobKey number
export function nupsiLogin(params) {
  return (dispatch, getState) => {
    // Store loading state
    dispatch(logging_in());
    // Send API request including login information
    return fetch(meineapagapi + 'api/auth/nupsiLogin', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
      .then(response => response.json())
      .then(responseJson => {
        // Handle the login response
        if (
          typeof responseJson.error !== typeof undefined ||
          (typeof responseJson.user !== typeof undefined &&
            typeof responseJson.user.error !== typeof undefined) ||
          typeof responseJson.access_token === typeof undefined
        ) {
          return dispatch(loginFailure());
        } else {
          return dispatch(loginSuccess(responseJson));
        }
      })
      .catch(_error => {
        return dispatch(loginFailure());
      });
  };
}

// Initiate logout - send API request
export function logout() {
  return (dispatch, getState) => {
    // Default Redux response for the logout function
    const answer = {
      type: LOGGED_OUT,
    };
    // Retrieve the currently valid JWT either from store (if still valid) or request a new one (if the renew date is not expired)
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        // Send logout request to the Meine APAG API
        return fetch(meineapagapi + 'api/auth/logout', {
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
            return handleAuth(responseJson, dispatch, getState)
              .then(authenticated => {
                if (authenticated) {
                  if (
                    (typeof responseJson.user !== typeof undefined &&
                      typeof responseJson.user.error !== typeof undefined) ||
                    (typeof responseJson.message !== typeof undefined &&
                      responseJson.message !== 'Erfolreich ausgeloggt')
                  ) {
                    // Retry logout again if there has been a problem while authenticating at the API
                    return dispatch(logout());
                  } else {
                    return dispatch(answer);
                  }
                } else {
                  return dispatch(answer);
                }
                // If the user has to change his password he is not able to logout
                // @todo does that make any sense
              })
              .catch(error => checkIfPasswordResetNeeded(dispatch, error));
          })
          .catch(() => {
            return dispatch(answer);
          });
      })
      .catch(_e => {
        return dispatch(answer);
      });
  };
}

// After user request successfully
export function getCurrentUserSuccessful(data) {
  return {
    type: GOT_CURRENT_USER,
    user: data,
  };
}

// While request current user
export function gettingCurrentUser(params = true) {
  return {
    type: GETTING_CURRENT_USER,
    showLoading: params,
  };
}

export function checkIfPasswordResetNeeded(dispatch, error, cb) {
  if (typeof error.reset !== typeof undefined && error.reset === 'password') {
    return dispatch(hasToChangePassword());
  }
  if (typeof cb !== typeof undefined) {
    return cb();
  }
}

// Initiate requesting the currently logged in user
export function getCurrentUser(showLoading = true) {
  return (dispatch, getState) => {
    dispatch(gettingCurrentUser(showLoading));
    return getAuthToken(dispatch, getState, showLoading)
      .then(accessToken => {
        return fetch(meineapagapi + 'api/v1/me', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            return handleAuth(responseJson, dispatch, getState, showLoading)
              .then(authenticated => {
                if (authenticated) {
                  if (
                    (typeof responseJson.user !== typeof undefined &&
                      typeof responseJson.user.error !== typeof undefined) ||
                    typeof responseJson.message !== typeof undefined
                  ) {
                    return dispatch(getCurrentUser());
                  } else {
                    return dispatch(getCurrentUserSuccessful(responseJson));
                  }
                } else {
                  return dispatch(getCurrentUserFailure(false));
                }
              })
              .catch(error => checkIfPasswordResetNeeded(dispatch, error));
          })
          .catch(error => {
            if (
              typeof error.message !== typeof undefined &&
              (error.message === 'Network request failed' ||
                error.message === 'Too Many Attempts.')
            ) {
              return dispatch(getCurrentUserFailure(true));
            } else {
              return dispatch(getCurrentUserFailure(false));
            }
          });
      })
      .catch(e => {
        if (
          typeof e.error !== typeof undefined &&
          e.error === 'Could not retrieve JWT.'
        ) {
          if (e.logout) {
            return dispatch({
              type: UNAUTHENTICATED,
            });
          } else {
            return dispatch(getCurrentUserFailure(true));
          }
        }
        return dispatch({
          type: UNAUTHENTICATED,
        });
      });
  };
}

export function getCurrentUserFailure(network) {
  return {
    type: GETTING_CURRENT_USER_FAILED,
    network,
  };
}

export function gettingCurrentUserDetails() {
  return {
    type: GETTING_CURRENT_USER_DETAILS,
  };
}

export function getCurrentUserDetails() {
  return (dispatch, getState) => {
    dispatch(gettingCurrentUserDetails());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return fetch(meineapagapi + 'api/v1/user/details', {
          method: 'GET',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
        })
          .then(response => response.json())
          .then(responseJson => {
            return handleAuth(responseJson, dispatch, getState)
              .then(authenticated => {
                if (authenticated) {
                  if (
                    (typeof responseJson.user !== typeof undefined &&
                      typeof responseJson.user.error !== typeof undefined) ||
                    typeof responseJson.message !== typeof undefined
                  ) {
                    return dispatch(getCurrentUserDetails());
                  } else {
                    return dispatch(
                      getCurrentUserDetailsSuccessful(responseJson),
                    );
                  }
                } else {
                  return dispatch(getCurrentUserDetailsFailure());
                }
              })
              .catch(err =>
                checkIfPasswordResetNeeded(dispatch, err, () =>
                  dispatch(getCurrentUserDetailsFailure()),
                ),
              );
          })
          .catch(() => {
            dispatch(getCurrentUserDetailsFailure());
          });
      })
      .catch(e => {
        if (
          typeof e.error !== typeof undefined &&
          e.error === 'Could not retrieve JWT.'
        ) {
          if (e.logout) {
            return dispatch({
              type: UNAUTHENTICATED,
            });
          } else {
            return dispatch(getCurrentUserDetailsFailure());
          }
        }
        return dispatch({
          type: UNAUTHENTICATED,
        });
      });
  };
}

export function getCurrentUserDetailsSuccessful(data) {
  return {
    type: GOT_CURRENT_USER_DETAILS,
    details: data,
  };
}

export function getCurrentUserDetailsFailure() {
  return {
    type: GETTING_CURRENT_USER_DETAILS_FAILED,
  };
}

export function updatingCurrentUserDetails() {
  return {
    type: UPDATING_CURRENT_USER_DETAILS,
  };
}

export function updateCurrentUserDetails(params) {
  return (dispatch, getState) => {
    let details = JSON.parse(JSON.stringify(params.details));
    if (params.personal) {
      details.IBAN = '';
      details.BIC = '';
      details.Bank = '';
      details.BLZ = '';
      details.Kontonummer = '';
    }
    dispatch(updatingCurrentUserDetails());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return fetch(meineapagapi + 'api/v1/user/updateDetails', {
          method: 'PUT',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + accessToken,
          },
          body: JSON.stringify(details),
        })
          .then(response => response.json())
          .then(responseJson => {
            return handleAuth(responseJson, dispatch, getState)
              .then(authenticated => {
                if (authenticated) {
                  if (
                    typeof responseJson.Anrede === typeof undefined ||
                    typeof responseJson.message !== typeof undefined
                  ) {
                    return dispatch(
                      updateCurrentUserDetailsFailure(responseJson),
                    );
                  } else {
                    return dispatch(
                      updateCurrentUserDetailsSuccessful(responseJson),
                    );
                  }
                } else {
                  return dispatch(
                    updateCurrentUserDetailsFailure({
                      General: [
                        'Es trat ein Fehler bei der Authorisierung auf.',
                      ],
                    }),
                  );
                }
              })
              .catch(err =>
                checkIfPasswordResetNeeded(dispatch, err, () =>
                  dispatch(
                    updateCurrentUserDetailsFailure({ General: [err.message] }),
                  ),
                ),
              );
          })
          .catch(error => {
            if (error.message === 'Network request failed') {
              return dispatch(
                updateCurrentUserDetailsFailure({
                  General: [
                    'Es trat ein Fehler bei der Anfrage zum Server auf.',
                  ],
                }),
              );
            }
            return dispatch(
              updateCurrentUserDetailsFailure({ General: [error.message] }),
            );
          });
      })
      .catch(e => {
        if (
          typeof e.error !== typeof undefined &&
          e.error === 'Could not retrieve JWT.'
        ) {
          if (e.logout) {
            return dispatch({
              type: UNAUTHENTICATED,
            });
          } else {
            return dispatch(updateCurrentUserDetailsFailure());
          }
        }
        return dispatch({
          type: UNAUTHENTICATED,
        });
      });
  };
}

export function updateCurrentUserDetailsFailure(data) {
  return {
    type: UPDATING_CURRENT_USER_DETAILS_FAILURE,
    errors: data,
  };
}

export function updateCurrentUserDetailsSuccessful(data) {
  return {
    type: UPDATING_CURRENT_USER_DETAILS_SUCCESS,
    details: data,
  };
}

export function resetPassword(params) {
  return (dispatch, getState) => {
    dispatch(resettingPassword());
    let formdata = new FormData();
    formdata.append('email', params.email);
    return fetch(meineapagapi + 'api/auth/password/reset', {
      method: 'POST',
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formdata,
    })
      .then(response => response.json())
      .then(responseJson => {
        if (
          typeof responseJson.error !== typeof undefined ||
          (typeof responseJson.user !== typeof undefined &&
            typeof responseJson.user.error !== typeof undefined)
        ) {
          return dispatch(resetPasswordFailure());
        } else {
          return dispatch(resetPasswordSuccessful());
        }
      })
      .catch(() => {
        return dispatch(resetPasswordFailure());
      });
  };
}

export function resetPasswordFailure() {
  return {
    type: RESET_PASSWORD_FAILURE,
  };
}

export function resetPasswordSuccessful() {
  return {
    type: RESET_PASSWORD_SUCCESS,
  };
}

export function resettingPassword() {
  return {
    type: RESETTING_PASSWORD,
  };
}

export function updatingPassword() {
  return {
    type: UPDATING_PASSWORD,
  };
}

export function updatePassword(params) {
  return (dispatch, getState) => {
    dispatch(updatingPassword());
    const keys = Object.keys(params);
    let formData = new FormData();
    for (var j = 0; j < keys.length; j++) {
      formData.append(keys[j], params[keys[j]]);
    }
    return getAuthToken(dispatch, getState).then(accessToken => {
      return fetch(meineapagapi + 'api/v1/user/changeLoginDetails', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          Authorization: 'Bearer ' + accessToken,
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          return handleAuth(responseJson, dispatch, getState).then(
            authenticated => {
              if (authenticated) {
                if (
                  typeof responseJson.message === typeof undefined ||
                  responseJson.message !== 'success'
                ) {
                  return dispatch(updatePasswordFailure(responseJson));
                } else {
                  return dispatch(updatePasswordSuccessful(responseJson));
                }
              } else {
                return dispatch(updatePasswordFailure(responseJson));
              }
            },
          );
        })
        .catch(error => {
          return dispatch(updatePasswordFailure({ General: [error.message] }));
        });
    });
  };
}

export function hasToChangePassword() {
  return {
    type: CHANGE_PASSWORD_ONCE,
  };
}

export function updatePasswordSuccessful() {
  return {
    type: UPDATE_PASSWORD_SUCCESS,
  };
}

export function updatePasswordFailure(errors) {
  return {
    type: UPDATE_PASSWORD_FAILURE,
    errors,
  };
}

export function registeredFCMToken(token) {
  return {
    type: REGISTERED_FCM_TOKEN,
    token,
  };
}

export function registerFCMToken(params) {
  return (dispatch, getState) => {
    dispatch(registeredFCMToken(params.token));
  };
}

export function sendingFCMToken() {
  return {
    type: SENDING_FCMTOKEN,
  };
}

export function sendFCMToken(params) {
  return (dispatch, getState) => {
    dispatch(sendingFCMToken());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return sendFCMTokenAfterAuth(
          params.token,
          accessToken,
          dispatch,
          getState,
        );
      })
      .catch(_e => {
        return sendFCMTokenAfterAuth(params.token, false, dispatch, getState);
      });
  };
}

function sendFCMTokenAfterAuth(token, accessToken, dispatch, getState) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken;
  }
  return fetch(meineapagapi + 'api/v1/fcmtoken', {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify({ token }),
  })
    .then(response => response.json())
    .then(responseJson => {
      return handleAuth(responseJson, dispatch, getState).then(
        authenticated => {
          if (authenticated) {
            if (
              typeof responseJson.message === typeof undefined ||
              responseJson.message !== 'success'
            ) {
              return dispatch(sendingFCMTokenFailure(responseJson));
            } else {
              return dispatch(sendingFCMTokenSuccessful(responseJson));
            }
          } else {
            return dispatch(sendingFCMTokenFailure(responseJson));
          }
        },
      );
    })
    .catch(error => {
      return dispatch(sendingFCMTokenFailure({ General: [error.message] }));
    });
}

export function sendingFCMTokenSuccessful() {
  return {
    type: SENDING_FCMTOKEN_SUCCESS,
  };
}

export function sendingFCMTokenFailure() {
  return {
    type: SENDING_FCMTOKEN_FAILURE,
  };
}

export function deletingFCMToken() {
  return {
    type: DELETING_FCMTOKEN,
  };
}

export function deleteFCMToken(params) {
  return (dispatch, getState) => {
    dispatch(deletingFCMToken());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return deleteFCMTokenAfterAuth(
          params.token,
          accessToken,
          dispatch,
          getState,
        );
      })
      .catch(_e => {
        return deleteFCMTokenAfterAuth(params.token, false, dispatch, getState);
      });
  };
}

function deleteFCMTokenAfterAuth(token, accessToken, dispatch, getState) {
  let headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers.Authorization = 'Bearer ' + accessToken;
  }
  return fetch(meineapagapi + 'api/v1/fcmtoken', {
    method: 'DELETE',
    credentials: 'include',
    headers,
    body: JSON.stringify({ token }),
  })
    .then(response => response.json())
    .then(responseJson => {
      return handleAuth(responseJson, dispatch, getState).then(
        authenticated => {
          if (authenticated) {
            if (
              typeof responseJson.message === typeof undefined ||
              responseJson.message !== 'success'
            ) {
              return dispatch(deletingFCMTokenFailure(responseJson));
            } else {
              return dispatch(deletingFCMTokenSuccessful(responseJson));
            }
          } else {
            return dispatch(deletingFCMTokenFailure(responseJson));
          }
        },
      );
    })
    .catch(error => {
      return dispatch(deletingFCMTokenFailure({ General: [error.message] }));
    });
}

export function deletingFCMTokenSuccessful() {
  return {
    type: DELETING_FCMTOKEN_SUCCESS,
  };
}

export function deletingFCMTokenFailure() {
  return {
    type: DELETING_FCMTOKEN_FAILURE,
  };
}
