import { combineReducers } from 'redux';

import { userReducer } from './userReducer';
import { roomReducer } from './roomReducer';
import { criticalErrReducer } from './criticalErrReducer';
import { waitingForReducer } from './waitingForReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  room: roomReducer,
  criticalErr: criticalErrReducer,
  waitingFor: waitingForReducer,
});
