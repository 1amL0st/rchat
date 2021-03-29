import { msgHandler } from './msgHandler';
import { AppStore } from '../store/store';

export const Api = {
  socket: null,

  async connect() {
    return new Promise((resolve, reject) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
          + window.location.host
      }/ws/`;
      this.socket = new WebSocket(wsURI);

      this.socket.onopen = () => {
        console.log('Socket opened!');
        this.socket.addEventListener('message', msgHandler.bind(this));
        resolve();
      };

      this.socket.onclose = () => {
        console.error('Socket was closed!');
      };

      this.socket.onerror = () => {
        reject(new Error('Some error happened!'));
      };
    });
  },

  sendMsg(msg) {
    this.socket.send(msg);
  },

  getCurrentRoomName() {
    this.socket.send('/current_room');
  },

  getUserList() {
    this.socket.send('/list_users');
  },

  getRoomList() {
    this.socket.send('/list_rooms');
  },

  clearUserList() {
    AppStore.dispatch({
      type: 'ClearUserList',
    });
  },

  clearInbox(lastMsg) {
    AppStore.dispatch({
      type: 'ClearInbox',
      lastMsg,
    });
  },

  updateAfterJoin(json) {
    this.clearInbox({
      author: json.author,
      text: json.text,
    });

    this.getRoomList();
    this.getCurrentRoomName();

    this.clearUserList();
    this.getUserList();
  },

  async joinRoom(room) {
    return new Promise((resolve, reject) => {
      const { socket } = this;

      const handler = (e) => {
        const json = JSON.parse(e.data);
        if (json.subType === 'YouJoinedRoom') {
          socket.removeEventListener('message', handler);
          this.updateAfterJoin(json);
          resolve();
        } else {
          socket.removeEventListener('message', handler);
          reject(json.text);
        }
      };

      socket.addEventListener('message', handler);
      socket.send(`/join ${room}`);
    });
  },

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
          console.log('REJECT!');
          reject(json.text);
        }
      };

      socket.addEventListener('message', handler);
      socket.send(`/login ${login}`);
    });
  },

  async createRoom(roomName) {
    return new Promise((resolve, reject) => {
      const { socket } = this;

      const handler = (e) => {
        const json = JSON.parse(e.data);
        if (json.subType === 'YouJoinedRoom') {
          socket.removeEventListener('message', handler);
          this.updateAfterJoin(json);
          resolve();
        } else {
          reject(json.text);
        }
      };

      socket.addEventListener('message', handler);
      socket.send(`/create_room ${roomName}`);
    });
  },
};