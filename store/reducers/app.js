import {
  HAS_SEEN_LOGIN_LAUNCHSCREEN,
  IS_IN_LAUNCH_FLOW,
} from '../actions/constants';

/**
 * Handles the initial Redux store for the rabatt property
 * Defines global Redux "event" handler for different kind of actions
 * Handles the storage of the request QR-Code data
 */

const initialState = {
  app: {
    hasSeenLaunchLoginScreen: false,
    isInLaunchFlow: false,
    initialRoute: null,
  },
};

function app(state = initialState, action) {
  switch (action.type) {
    case HAS_SEEN_LOGIN_LAUNCHSCREEN:
      return {
        ...state,
        app: {
          ...state.app,
          hasSeenLaunchLoginScreen:
            typeof action.value !== typeof undefined ? action.value : true,
        },
      };
    case IS_IN_LAUNCH_FLOW:
      return {
        ...state,
        app: {
          ...state.app,
          isInLaunchFlow:
            typeof action.value !== typeof undefined ? action.value : true,
        },
      };
    default:
      return state;
  }
}

module.exports = app;
