const DEFAULT_STATE = {
  isWaiting: false,
  waitingText: '',
};

export const waitingForReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'ShowWaitingForWindow':
      return {
        isWaiting: true,
        waitingText: action.waitingText,
      };
    case 'HideWaitingForWindow':
      return {
        isWaiting: false,
        waitingText: '',
      };
    default:
      return state;
  }
};
