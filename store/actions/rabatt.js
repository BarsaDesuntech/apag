import {
  FETCHING_RABATT_QR,
  FETCHING_RABATT_QR_SUCCESS,
  FETCHING_RABATT_QR_FAILURE,
  UNAUTHENTICATED,
} from './constants';
import {handleAuth, getAuthToken} from './helpers';
import {meineapagapi} from '../../env';
import {checkIfPasswordResetNeeded} from './user';

export function gettingRabatt() {
  return {
    type: FETCHING_RABATT_QR,
  };
}

export function gettingRabattSuccess(data) {
  return {
    type: FETCHING_RABATT_QR_SUCCESS,
    rabatt: data,
  };
}

export function gettingRabattFailure() {
  return {
    type: FETCHING_RABATT_QR_FAILURE,
  };
}

export function getRabattQR() {
  return (dispatch, getState) => {
    dispatch(gettingRabatt());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return fetch(meineapagapi + 'api/v1/rabatt/qr', {
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
                  if (typeof responseJson.qr !== typeof undefined) {
                    return dispatch(gettingRabattSuccess(responseJson));
                  } else {
                    return dispatch(getRabattQR());
                  }
                } else {
                  return dispatch(gettingRabattFailure());
                }
              })
              .catch(error => checkIfPasswordResetNeeded(dispatch, error));
          })
          .catch(() => {
            return dispatch(gettingRabattFailure());
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
            return dispatch(gettingRabattFailure());
          }
        }
        return dispatch({
          type: UNAUTHENTICATED,
        });
      });
  };
}
