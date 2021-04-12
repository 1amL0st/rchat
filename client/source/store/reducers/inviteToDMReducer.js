import i18n from 'i18next';

import { STATES } from 'api/InviteToDMController';

const DEFAULT_STATE = {
  state: STATES.Processed,
  isFailed: false,
  errText: '',
  isAccepted: false,
  isRefused: false,
  isIncoming: false,
  incomingCanceled: false,
  came: false,
  processed: false,
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
        came: false,
      };
    case 'ShowIncomingToDMRequest':
      return {
        state: STATES.Incoming,
        isIncoming: true,
        came: true,
        processed: false,
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
        isFailed: false,
        isRefused: false,
        isAccepted: false,
        isIncoming: false,
        came: true,
        processed: false,
        guestLogin: action.guestLogin,
        waitingText: i18n.t('inviteToDM.waitingForUserResponse'),
      };
    case 'HideInviteToDMWindow':
      return {
        ...state,
        state: STATES.Processed,
        processed: true,
      };
    case 'OutcomingInviteToDMRefused':
      return {
        ...state,
        state: STATES.Refused,
        isRefused: true,
      };
    case 'OutcomingInviteToDMAccepted':
      return {
        ...state,
        isAccepted: true,
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
