import { AppStore } from 'store/store';

export function UserController(socketObj) {
  return {
    socket: socketObj,

    async setNewLogin(login) {
      return new Promise((resolve, reject) => {
        const { socket } = this;

        const handler = (e) => {
          const json = JSON.parse(e.data);
          if (json.subType === 'LoggingFailed') {
            socket.removeEventListener('message', handler);
            reject(json.text);
          } else {
            socket.removeEventListener('message', handler);
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
          const json = JSON.parse(e.data);
          if (json.subType === 'LoggingSuccess') {
            socket.removeEventListener('message', handler);
            resolve(json.login);
          } else {
            reject(json.text);
          }
        };

        socket.addEventListener('message', handler);
        socket.send(`/login ${login}`);
      });
    },
  };
}