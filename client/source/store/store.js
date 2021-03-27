import { createStore } from 'redux';

import { rootReducer } from './reducers/rootReducer';

export const AppStore = createStore(rootReducer, {});
