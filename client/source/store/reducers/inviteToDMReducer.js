import i18n from 'i18next';

const DEFAULT_STATE = {
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
        isFailed: false,
        came: false,
      };
    case 'ShowIncomingToDMRequest':
      return {
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
        incomingCanceled: true,
      };
    case 'ShowOutcomingToDMRequest':
      return {
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
        processed: true,
      };
    case 'OutcomingInviteToDMRefused':
      return {
        ...state,
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
        isFailed: true,
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
