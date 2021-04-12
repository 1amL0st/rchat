import i18n from 'i18next';

import { STATES } from 'api/InviteToDMController';

const DEFAULT_STATE = {
  state: STATES.Processed,
  errText: '',
  inviterLogin: '',
  guestLogin: '',
  waitingText: '',
};

export const inviteToDMReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'HideErrWindow':
      return {
        ...state,
        state: STATES.Failed,
      };
    case 'ShowIncomingToDMRequest':
      return {
        state: STATES.Incoming,
        inviterLogin: action.inviterLogin,
      };
    case 'OutcomingInviteToDMCanceled':
      return {
        guestLogin: '',
      };
    case 'IncomingInviteToDMCanceled':
      return {
        ...state,
        state: STATES.Canceled,
      };
    case 'ShowOutcomingToDMRequest':
      return {
        state: STATES.Came,
        guestLogin: action.guestLogin,
        waitingText: i18n.t('inviteToDM.waitingForUserResponse'),
      };
    case 'HideInviteToDMWindow':
      return {
        ...state,
        state: STATES.Processed,
      };
    case 'OutcomingInviteToDMRefused':
      return {
        ...state,
        state: STATES.Refused,
      };
    case 'OutcomingInviteToDMAccepted':
      return {
        ...state,
      };
    case 'InviteUserToDMFail':
      return {
        ...state,
        state: STATES.Failed,
        errText: action.err,
      };
    case 'InviteUserToDMWaitForRoomCreate':
      return {
        ...state,
        waitingText: action.waitingText,
      };
    default:
      return state;
  }
};
