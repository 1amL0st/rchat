import { MAIN_ROOM_NAME } from 'constants/Api';
import { msgHandler } from './msgHandler';
import { AppStore } from '../store/store';
/*
  NOTE: These two functions... Maybe you shuold place them in separate file...
        And make two functions for showing|hiding criticalErrWindow...
*/

function showWaitingWindow(text) {
  AppStore.dispatch({
    type: 'ShowWaitingForWindow',
    waitingText: text,
  });
}

function hideWaitingWindow() {
  AppStore.dispatch({
    type: 'HideWaitingForWindow',
  });
}

export const Api = {
  socket: null,

  async connect() {
    return new Promise((resolve) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
        + window.location.host
      }/ws/`;

      showWaitingWindow('Waiting for connection');

      this.socket = new WebSocket(wsURI);

      // TODO: Detect if user is offline
      this.socket.onclose = () => {
        hideWaitingWindow();
        AppStore.dispatch({
          type: 'SetCriticalErr',
          errText: 'Socket was closed! This is critical error!',
        });
      };

      this.socket.onerror = () => {
        hideWaitingWindow();
        AppStore.dispatch({
          type: 'SetCriticalErr',
          errText: 'Some error happened!',
        });
      };

      this.socket.onopen = () => {
        hideWaitingWindow();
        this.socket.addEventListener('message', msgHandler.bind(this));
        resolve();
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

  inviteToDM(login) {
    const store = AppStore.getState();
    const userLogin = store.user.login;
    const { roomName } = store.room;

    if (userLogin !== login && roomName === MAIN_ROOM_NAME) {
      const request = `/invite_to_dm ${login}`;

      AppStore.dispatch({
        type: 'ShowOutcomingToDMRequest',
        guestLogin: login,
      });

      console.log('Request = ', request);
      this.socket.send(request);
    }
  },

  acceptInviteToDM() {
    this.socket.send('/invite_to_dm_accept');
  },

  refuseInviteToDM() {
    this.socket.send('/invite_to_dm_refuse');
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

  clearInboxExceptLast() {
    AppStore.dispatch({
      type: 'ClearInboxExceptLast',
    });
  },

  updateAfterJoin() {
    this.clearInboxExceptLast();

    this.getRoomList();
    this.getCurrentRoomName();

    this.clearUserList();
    this.getUserList();
  },

  async joinRoom(room) {
    return new Promise((resolve) => {
      const { socket } = this;

      const handler = (e) => {
        const json = JSON.parse(e.data);
        if (json.subType === 'YouJoinedRoom') {
          socket.removeEventListener('message', handler);
          this.updateAfterJoin();
          resolve();
        } else {
          socket.removeEventListener('message', handler);
          resolve();
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
