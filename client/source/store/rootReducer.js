export const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UserLogin':
      return {
        ...state,
        userLogin: action.userLogin,
      };
    default:
      return state;
  }
};