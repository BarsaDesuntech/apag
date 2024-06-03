import { applyMiddleware, createStore } from 'redux';
import reducers from './reducers';
import { persistStore } from 'redux-persist';
import thunk from 'redux-thunk';

/**
 * Map the store to window for debugging
 */
const isDebuggingInChrome = false;

/**
 * Apply redux middleware when needed
 */
const createCustomStore = applyMiddleware(thunk)(createStore);

// Important to notice is that redux-persist is used which handles the "offline" saving of the redux store to the device
function configureStore() {
  let store = createCustomStore(reducers);
  if (isDebuggingInChrome) {
    window.store = store;
  }
  let persistor = persistStore(store);
  return { store, persistor };
}

module.exports = configureStore;
