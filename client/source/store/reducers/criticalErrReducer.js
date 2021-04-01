const DEFAULT_STATE = {
  isErr: false,
  errText: '',
};

export const criticalErrReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SetCriticalErr':
      return {
        isErr: true,
        errText: action.errText,
      };
    default:
      return state;
  }
};
