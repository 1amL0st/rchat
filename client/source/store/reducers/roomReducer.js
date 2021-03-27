const DEFAULT_STATE = {
  messages: [],
  roomName: 'Loading...',
  rooms: [],
  users: [],
};

export const roomReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'SetUserList':
      console.log('SetUserList!');
      return {
        ...state,
        users: action.users,
      };
    case 'SetRoomName':
      return {
        ...state,
        roomName: action.name,
      };
    case 'AddMsg':
      return {
        ...state,
        messages: [...state.messages, action.message],
      };
    default:
      return state;
  }
};
