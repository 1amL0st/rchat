const DEFAULT_STATE = {
  isLogged: true,
  login: 'Loading...',
};

export const userReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'LoggingSuccess':
      return {
        isLogged: false,
        login: action.login,
      };
    case 'ChangeUserLogin':
      return {
        ...state,
        login: action.login,
      };
    default:
      return state;
  }
};
