const DEFAULT_STATE = {
  isUserList: false,
  isRoomList: false,
};

export const asidesReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'AsidesOpenUserList':
      return {
        ...state,
        isUserList: true,
      };
    case 'AsidesHideUserList':
      return {
        ...state,
        isUserList: false,
      };
    case 'AsidesShowRoomList':
      return {
        ...state,
        isRoomList: true,
      };
    case 'AsidesHideRoomList':
      return {
        ...state,
        isRoomList: false,
      };
    default:
      return state;
  }
};
