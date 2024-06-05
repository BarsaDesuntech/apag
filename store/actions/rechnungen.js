import {
  FETCHING_RECHNUNGEN,
  FETCHING_RECHNUNGEN_SUCCESS,
  FETCHING_RECHNUNGEN_FAILURE,
  DOWNLOADED_RECHNUNG,
  DOWNLOAD_RECHNUNG_FAILURE,
  UNAUTHENTICATED,
  CHECKED_DOWNLOADS,
} from './constants';
import {handleAuth, getAuthToken} from './helpers';
import {meineapagapi} from '../../env';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {checkIfPasswordResetNeeded} from './user';

export function gettingRechnungen() {
  return {
    type: FETCHING_RECHNUNGEN,
  };
}

export function gettingRechnungenSuccess(data) {
  return {
    type: FETCHING_RECHNUNGEN_SUCCESS,
    rechnungen: data.data,
  };
}

export function gettingRechnungenFailure() {
  return {
    type: FETCHING_RECHNUNGEN_FAILURE,
  };
}

export function getRechnungen(params) {
  return (dispatch, getState) => {
    dispatch(gettingRechnungen());
    return getAuthToken(dispatch, getState)
      .then(accessToken => {
        return fetch(
          meineapagapi +
            'api/v1/rechnungen/table?order=desc&column=Rechnungsdatum',
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + accessToken,
            },
          },
        )
          .then(response => response.json())
          .then(responseJson => {
            return handleAuth(responseJson, dispatch, getState)
              .then(authenticated => {
                if (authenticated) {
                  if (typeof responseJson.data !== typeof undefined) {
                    return dispatch(gettingRechnungenSuccess(responseJson));
                  } else {
                    return dispatch(getRechnungen(params));
                  }
                } else {
                  return dispatch(gettingRechnungenFailure());
                }
              })
              .catch(err =>
                checkIfPasswordResetNeeded(dispatch, err, () =>
                  dispatch(gettingRechnungenFailure()),
                ),
              );
          })
          .catch(_error => {
            return dispatch(gettingRechnungenFailure());
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
            return dispatch(gettingRechnungenFailure());
          }
        }
        return dispatch({
          type: UNAUTHENTICATED,
        });
      });
  };
}

export function downloadedRechnung(params) {
  return {
    type: DOWNLOADED_RECHNUNG,
    rechnung: params.Rechnungsnummer,
  };
}

export function downloadRechnungFailure(params) {
  return {
    type: DOWNLOAD_RECHNUNG_FAILURE,
    rechnung: params.Rechnungsnummer,
  };
}

export function checkDownloads(params) {
  return (dispatch, getState) => {
    let currentState = getState();
    if (
      typeof currentState.rechnungen.downloadedRechnungen !==
        typeof undefined &&
      !!currentState.rechnungen.downloadedRechnungen.length
    ) {
      const SavePath =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.ExternalDirectoryPath;
      return RNFS.readDir(SavePath + '/rechnungen/').then(result => {
        let newDownloadedRechnungen = [];
        for (var i = 0; i < result.length; i++) {
          const name = result[i].name.replace('.pdf', '');
          if (
            currentState.rechnungen.downloadedRechnungen.indexOf(name) !== -1
          ) {
            newDownloadedRechnungen.push(name);
          }
        }
        return dispatch(checkedDownloads(newDownloadedRechnungen));
      });
    } else {
      return dispatch(checkedDownloads([]));
    }
  };
}

export function checkedDownloads(newRechnungen) {
  return {
    type: CHECKED_DOWNLOADS,
    downloadedRechnungen: newRechnungen,
  };
}
