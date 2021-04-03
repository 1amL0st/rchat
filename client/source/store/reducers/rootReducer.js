import { combineReducers } from 'redux';

import { userReducer } from './userReducer';
import { roomReducer } from './roomReducer';
import { criticalErrReducer } from './criticalErrReducer';
import { waitingForReducer } from './waitingForReducer';
import { inviteToDMReducer } from './inviteToDMReducer';

export const rootReducer = combineReducers({
  user: userReducer,
  room: roomReducer,
  criticalErr: criticalErrReducer,
  waitingFor: waitingForReducer,
  inviteDM: inviteToDMReducer,
});
