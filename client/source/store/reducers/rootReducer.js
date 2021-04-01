import { combineReducers } from 'redux';

import { userReducer } from './userReducer';
import { roomReducer } from './roomReducer';
import { criticalErrReducer } from './criticalErrReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  room: roomReducer,
  criticalErr: criticalErrReducer,
});
