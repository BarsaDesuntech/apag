import {
  FETCHING_RABATT_QR,
  FETCHING_RABATT_QR_SUCCESS,
  FETCHING_RABATT_QR_FAILURE,
} from '../actions/constants';

/**
 * Handles the initial Redux store for the rabatt property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the request QR-Code data
 */

const initialState = {
  rabatt: {},
  isFetching: false,
  error: false,
};

function rabatt(state = initialState, action) {
  switch (action.type) {
    case FETCHING_RABATT_QR:
      return {
        ...state,
        isFetching: true,
      };
    case FETCHING_RABATT_QR_SUCCESS:
      return {
        ...state,
        isFetching: false,
        rabatt: action.rabatt,
      };
    case FETCHING_RABATT_QR_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
}

module.exports = rabatt;
