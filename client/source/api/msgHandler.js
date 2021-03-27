import { AppStore } from 'store/store';
import { Socket } from './Socket';

const dataMsgHandler = (msgJson) => {
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
    default:
      console.warn('Unknown subtype!');
      break;
  }
};

export const msgHandler = (e) => {
  const json = JSON.parse(e.data);

  if (json.type === 'DataMsg') {
    dataMsgHandler(json);
  }

  if (json.subType === 'LoggingSuccess') {
    AppStore.dispatch({
      type: 'LoggingSuccess',
      login: json.login,
    });

    Socket.getCurrentRoomName();
    Socket.getUserList();
  }

  if (json.author && json.text) {
    json.text = json.text
      .replace(/\n/g, '\\\\n')
      .replace(/\r/g, '\\\\r')
      .replace(/\t/g, '\\\\t');

    AppStore.dispatch({
      type: 'AddMsg',
      message: json,
    });
  }
};
