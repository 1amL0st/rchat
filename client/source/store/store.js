import { createStore, applyMiddleware, compose } from 'redux';

import { rootReducer } from './reducers/rootReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const AppStore = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware()),
);

console.log('RUNNING STORE>JS');
