import {
  FETCHING_RECHNUNGEN,
  FETCHING_RECHNUNGEN_SUCCESS,
  FETCHING_RECHNUNGEN_FAILURE,
  DOWNLOADED_RECHNUNG,
  DOWNLOAD_RECHNUNG_FAILURE,
  LOGGED_OUT,
  CHECKED_DOWNLOADS,
} from '../actions/constants';
import RNFS from 'react-native-fs';
import {Platform} from 'react-native';

/**
 * Handles the initial Redux store for the rechnungen property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the invoices data including the download action
 * Handles the log out action for which we have to delete all locally stored/downloaded invoices from the device
 */

const initialState = {
  rechnungen: [],
  downloadedRechnungen: [],
  isFetching: false,
  error: false,
};

function rechnungen(state = initialState, action) {
  switch (action.type) {
    case CHECKED_DOWNLOADS:
      return {
        ...state,
        downloadedRechnungen: action.downloadedRechnungen,
      };
    case FETCHING_RECHNUNGEN:
      return {
        ...state,
        isFetching: true,
      };
    case FETCHING_RECHNUNGEN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        rechnungen: action.rechnungen,
      };
    case FETCHING_RECHNUNGEN_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case LOGGED_OUT:
      const SavePath =
        Platform.OS === 'ios'
          ? RNFS.DocumentDirectoryPath
          : RNFS.ExternalDirectoryPath;
      RNFS.readDir(SavePath + '/rechnungen/')
        .then((result) => {
          let files = [];
          for (var i = 0; i < result.length; i++) {
            files.push(RNFS.stat(result[i].path));
          }
          return Promise.all(files);
        })
        .then((statResult) => {
          let deletePromises = [];
          for (var j = 0; j < statResult.length; j++) {
            if (statResult[j].isFile()) {
              deletePromises.push(RNFS.unlink(statResult[j].path));
            }
          }
          return Promise.all(deletePromises);
        })
        .catch((err) => {
          console.log(err.message, err.code);
        });
      return {
        ...initialState,
      };
    case DOWNLOADED_RECHNUNG:
      var downloadedRechnungen = state.downloadedRechnungen;
      if (typeof action.rechnung !== typeof undefined) {
        downloadedRechnungen.push(action.rechnung);
      }
      return {
        ...state,
        downloadedRechnungen,
      };
    case DOWNLOAD_RECHNUNG_FAILURE:
      var downloadedRechnungen = state.downloadedRechnungen;
      if (typeof action.rechnung !== typeof undefined) {
        let index = downloadedRechnungen.indexOf(action.rechnung);
        if (index !== -1) {
          downloadedRechnungen.splice(index, 1);
        }
      }
      return {
        ...state,
        downloadedRechnungen,
      };
    default:
      return state;
  }
}

module.exports = rechnungen;
