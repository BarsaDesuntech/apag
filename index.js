import Bugsnag from '@bugsnag/react-native';
Bugsnag.start();

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { name as appName } from './app.json';

const WrappedApp = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <App />
  </GestureHandlerRootView>
);

AppRegistry.registerComponent(appName, () => WrappedApp);
