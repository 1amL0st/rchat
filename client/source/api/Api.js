import { Socket } from './Socket';
import { msgHandler } from './msgHandler';
import { AppStore } from '../store/store';

export const Api = {};

export const InitApi = () => {
  Socket.socket.addEventListener('message', msgHandler.bind(Api));

  Api.getCurrentRoomName = () => {
    Socket.socket.send('/current_room');
  };

  Api.getUserList = () => {
    Socket.socket.send('/list_users');
  };

  Api.getRoomList = () => {
    Socket.socket.send('/list_rooms');
  };

  Api.clearInbox = (lastMsg) => {
    AppStore.dispatch({
      type: 'ClearInbox',
      lastMsg,
    });
  };

  Api.joinRoom = async (room) =>
    new Promise((resolve, reject) => {
      const { socket } = Socket;

      const handler = (e) => {
        const json = JSON.parse(e.data);
        if (
          json.subType === 'UserJoinedRoom' &&
          json.text.startsWith('You joined')
        ) {
          socket.removeEventListener('message', handler);
          Api.clearInbox({
            author: json.author,
            text: json.text,
          });
          resolve();
          Api.getRoomList();
        } else {
          socket.removeEventListener('message', handler);
          reject(json.text);
        }
      };

      socket.addEventListener('message', handler);
      socket.send(`/join ${room}`);
    });

  Api.setNewLogin = async (login) =>
    new Promise((resolve, reject) => {
      const { socket } = Socket;

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

  Api.logging = async (login) =>
    new Promise((resolve, reject) => {
      const { socket } = Socket;

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
};
