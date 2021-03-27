import { createStore } from 'redux';

import { rootReducer } from './rootReducer';

export const AppStore = createStore(rootReducer, ['Use Redux']);