import { persistCombineReducers, createMigrate } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define migrations for the redux store which is applied when launching the app
// This can be used if the data structure changes or if there have been issues before
const migrations = {
  2: state => {
    // migration clear parkhouses
    return {
      ...state,
      parkhouses: {
        parkhouses: [],
        isFetching: false,
        error: false,
      },
    };
  },
  3: state => {
    return {
      ...state,
      consent: {
        ...state.consent,
        filled: false,
      },
    };
  },
  4: state => {
    return {
      ...state,
      consent: {
        filled: state.consent.filled,
        settings: state.consent.settings,
      },
    };
  },
  5: state => {
    return {
      ...state,
      app: {
        hasSeenLaunchLoginScreen: false,
      },
    };
  },
  6: state => {
    return {
      ...state,
      app: {
        isInLaunchFlow: false,
      },
    };
  },
};

// Combines all reducers to one redux store which handle the interaction
const reducer = {
  parkhouses: require('./parkhouses'),
  rechnungen: require('./rechnungen'),
  user: require('./user'),
  rabatt: require('./rabatt'),
  consent: require('./consent'),
  app: require('./app'),
  registration: require('./registration'),
  mapParkSelect: require('./mapParkSelectSlice'),
  searchPark: require('./searchPark'),
};

// Export the persisted and combined Redux reducers
// The places (free charging stations) are never saved locally as they should only be shown if the data is up to date which means that the request could be executed
// The storage for the Redux store is the AsyncStorage provided by React Native
// The migrations from above are passed here
module.exports = persistCombineReducers(
  {
    key: 'root',
    version: 5,
    storage: AsyncStorage,
    blacklist: ['places', 'registration'],
    migrate: createMigrate(migrations, { debug: false }),
  },
  reducer,
);
