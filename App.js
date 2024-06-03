import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ActionSheetProvider } from '@expo/react-native-action-sheet'; // @TODO replace
import { Provider as PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { PersistGate } from 'redux-persist/integration/react';
import configureStore from './store/configureStore';
import AppNavigation from './navigation';
import SessionComponent from './components/sessionComponent';
import NotificationService from './components/notificationService';
import BugsnagService from './components/bugsnagService';
import 'react-native-gesture-handler';

const { store, persistor } = configureStore();

export default class Root extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar barStyle="light-content" backgroundColor="#3F6CB1" />
          <SessionComponent />
          <BugsnagService />
          <NotificationService />
          <ActionSheetProvider useCustomActionSheet={true}>
            <PaperProvider>
              <App />
            </PaperProvider>
          </ActionSheetProvider>
        </PersistGate>
      </Provider>
    );
  }
}

class App extends Component {
  render() {
    return <AppNavigation />;
  }
  componentDidMount() {
    // do stuff while splash screen is shown
    // After having done stuff (such as async tasks) hide the splash screen
    SplashScreen.hide();
  }
}
