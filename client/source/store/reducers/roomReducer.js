const DEFAULT_STATE = {
  messages: [],
  roomName: 'Loading...',
  rooms: [],
  users: [],
};

export const roomReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'LoginChange':
      return {
        ...state,
        users: state.users.map((login) => (login === action.oldLogin ? action.newLogin : login)),
      };
    case 'ClearInbox':
      return {
        ...state,
        messages: action.lastMsg ? [action.lastMsg] : [],
      };
    case 'RemoveRoom':
      return {
        ...state,
        rooms: state.rooms.filter((room) => room !== action.room),
      };
    case 'RemoveUser':
      return {
        ...state,
        users: state.users.filter((user) => user !== action.userLogin),
      };
    case 'SetRoomList':
      return {
        ...state,
        rooms: action.rooms,
      };
    case 'ClearUserList':
      return {
        ...state,
        users: [],
      };
    case 'SetUserList':
      return {
        ...state,
        users: action.users,
      };
    case 'SetRoomName':
      return {
        ...state,
        roomName: action.name,
      };
    case 'AddUser':
      return {
        ...state,
        users: [...state.users, action.login],
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
