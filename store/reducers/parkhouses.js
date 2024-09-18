import {
  FETCHING_PARKHOUSES,
  FETCHING_PARKHOUSES_SUCCESS,
  FETCHING_PARKHOUSES_FAILURE,
  FETCHING_PARKHOUSE,
  FETCHING_PARKHOUSE_SUCCESS,
  FETCHING_PARKHOUSE_FAILURE,
} from '../actions/constants';

/**
 * Handles the initial Redux store for the parkhouses property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the parkhouses
 */

const initialState = {
  parkhouses: [],
  isFetching: false,
  error: false,
  singleParkObject: {},
};

function parkhouses(state = initialState, action) {
  switch (action.type) {
    case FETCHING_PARKHOUSES:
      return {
        ...state,
        isFetching: true,
      };
    case FETCHING_PARKHOUSES_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: false,
        parkhouses: action.parkhouses,
      };
    case FETCHING_PARKHOUSES_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    case FETCHING_PARKHOUSE:
      return {
        ...state,
        isFetching: true,
      };
    case FETCHING_PARKHOUSE_SUCCESS:
      // let found = false;
      // for (var i = 0; i < state.parkhouses.length; i++) {
      //   if (state.parkhouses[i].id === action.parkhouse.id) {
      //     state.parkhouses[i] = action.parkhouse;
      //     found = true;
      //   }
      // }
      state.singleParkObject = action.parkhouse;

      // if (!found) {
      //   state.parkhouses.push(action.parkhouse);
      // }
      return {
        ...state,
        error: false,
        isFetching: false,
      };
    case FETCHING_PARKHOUSE_FAILURE:
      return {
        ...state,
        isFetching: false,
        error: true,
      };
    default:
      return state;
  }
}

module.exports = parkhouses;
