import { AppStore } from 'store/store';

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
    default:
      console.warn('Unknown server msg handler subType ', msgJson);
      return;
  }

  if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: msgJson,
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
      message: msgJson,
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
