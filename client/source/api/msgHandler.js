import { AppStore } from 'store/store';

function buildMsg(msgJson) {
  console.log('buildMsg = ', msgJson);
  const userLogin = AppStore.getState().user.login;
  return {
    ...msgJson,
    isOwn: msgJson.author === userLogin,
    author: msgJson.author === userLogin ? 'You' : msgJson.author,
  };
}

function dataMsgHandler(msgJson) {
  switch (msgJson.subType) {
    case 'CurRoom':
      AppStore.dispatch({
        type: 'SetRoomName',
        name: msgJson.name,
      });
      break;
    case 'UserList':
      AppStore.dispatch({
        type: 'SetUserList',
        users: msgJson.users,
      });
      break;
    case 'RoomList':
      AppStore.dispatch({
        type: 'SetRoomList',
        rooms: msgJson.rooms,
      });
      break;
    default:
      console.warn('Unknown subtype!');
      break;
  }
}

function serverMsgHandler(msgJson) {
  switch (msgJson.subType) {
    case 'RoomDestroyed':
      AppStore.dispatch({
        type: 'RemoveRoom',
        room: msgJson.room,
      });
      break;
    case 'UserLeftRoom':
      AppStore.dispatch({
        type: 'RemoveUser',
        userLogin: msgJson.login,
      });
      break;
    case 'UserConnected':
      this.getUserList();
      break;
    case 'LoginChangeNotify':
      AppStore.dispatch({
        type: 'LoginChange',
        oldLogin: msgJson.oldLogin,
        newLogin: msgJson.newLogin,
      });
      break;
    case 'LoggingFailed':
      return;
    case 'YouJoinedRoom':
      break;
    case 'UserJoinedRoom':
      AppStore.dispatch({
        type: 'AddUser',
        login: msgJson.login,
      });
      break;
    default:
      console.warn('Unknown server msg handler subType ', msgJson);
      return;
  }

  if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: buildMsg(msgJson),
    });
  }
}

export function msgHandler(e) {
  console.log('e.data = ', e.data);
  const msgJson = JSON.parse(e.data);

  if (msgJson.type === 'DataMsg') {
    dataMsgHandler.call(this, msgJson);
  } else if (msgJson.type === 'ServerMsg' || msgJson.author === 'Server') {
    serverMsgHandler.call(this, msgJson);
  } else if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: buildMsg(msgJson),
    });
  }

  if (msgJson.subType === 'LoggingSuccess') {
    AppStore.dispatch({
      type: 'LoggingSuccess',
      login: msgJson.login,
    });

    this.getCurrentRoomName();
    this.getUserList();
    this.getRoomList();
  }
}
