import { TranslateMessage } from 'i18n/MessageTranslator';

import { AppStore } from 'store/store';
import { Api } from 'api/Api';

export function UserController(socketObj) {
  return {
    socket: socketObj,

    async setNewLogin(login) {
      return new Promise((resolve, reject) => {
        const { socket } = this;

        const handler = (e) => {
          const json = TranslateMessage(JSON.parse(e.data));
          if (json.subType === 'LoggingFailed') {
            socket.removeEventListener('message', handler);
            reject(json.reason);
          } else {
            socket.removeEventListener('message', handler);

            AppStore.dispatch({
              type: 'SetUserLogin',
              login,
            });

            resolve();
          }
        };

        socket.addEventListener('message', handler);
        socket.send(`/login ${login}`);
      });
    },

    async logging(login) {
      return new Promise((resolve, reject) => {
        const { socket } = this;

        const handler = (e) => {
          const json = TranslateMessage(JSON.parse(e.data));
          if (json.subType === 'LoggingSuccess') {
            socket.removeEventListener('message', handler);
            AppStore.dispatch({
              type: 'SetUserLogin',
              login,
            });
            resolve(json.login);
          } else {
            reject(json.reason);
          }
        };

        socket.addEventListener('message', handler);
        socket.send(`/login ${login}`);
      });
    },

    msgHandler(msgJson) {
      switch (msgJson.subType) {
        case 'LoggingSuccess':
          AppStore.dispatch({
            type: 'LoggingSuccess',
            login: msgJson.login,
          });
          Api.commands.queryRoomInfo();
          break;
        case 'LoggingFailed':
          break;
        case 'LoginChangeNotify':
          AppStore.dispatch({
            type: 'LoginChange',
            oldLogin: msgJson.oldLogin,
            newLogin: msgJson.newLogin,
          });
          break;
        default:
          return false;
      }
      return true;
    },
  };
}
