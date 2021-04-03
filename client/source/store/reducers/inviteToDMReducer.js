const DEFAULT_STATE = {
  isAccepted: false,
  isRefused: false,
  isIncoming: false,
  came: false,
  processed: false,
  inviterLogin: '',
  guestLogin: '',
};

export const inviteToDMReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'ShowIncomingToDMRequest':
      return {
        isIncoming: true,
        came: true,
        processed: false,
        inviterLogin: action.inviterLogin,
      };
    case 'ShowOutcomingToDMRequest':
      return {
        isRefused: false,
        isAccepted: false,
        isIncoming: false,
        came: true,
        processed: false,
        guestLogin: action.guestLogin,
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
    default:
      return state;
  }
};