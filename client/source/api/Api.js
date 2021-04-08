import { MAIN_ROOM_NAME } from 'constants/Api';
import { msgHandler } from './msgHandler';
import { AppStore } from '../store/store';

import { WaitingForWindowController } from './WaitingForWindowController';
import { CriticalErrController } from './CriticalErrController';
import { UserController } from './UserController';
import { Commands } from './Commands';

/*
  NOTE: These two functions... Maybe you shuold place them in separate file...
        And make two functions for showing|hiding criticalErrWindow...
*/

export const Api = {
  socket: null,

  waitingForWindowController: WaitingForWindowController,
  criticalErrController: CriticalErrController,
  userController: null,
  commands: null,

  async connect() {
    return new Promise((resolve) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
        + window.location.host
      }/ws/`;

      this.waitingForWindowController.showWaitingWindow('Waiting for connection');

      this.socket = new WebSocket(wsURI);

      // TODO: Detect if user is offline
      this.socket.onclose = () => {
        this.waitingForWindowController.hideWaitingWindow();
        this.criticalErrController.setErr('Socket was closed! This is critical error!');
      };

      this.socket.onerror = () => {
        this.waitingForWindowController.hideWaitingWindow();
        this.criticalErrController.setErr('Some error happened!');
      };

      this.socket.onopen = () => {
        this.waitingForWindowController.hideWaitingWindow();
        this.socket.addEventListener('message', msgHandler.bind(this));

        this.userController = new UserController(this.socket);
        this.commands = new Commands(this.socket);

        resolve();
      };
    });
  },

  sendMsg(msg) {
    this.commands.sendMsg(msg);
  },

  getCurrentRoomName() {
    this.commands.getCurrentRoomName();
  },

  getUserList() {
    this.commands.getUserList();
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
    this.commands.acceptInviteToDM();
  },

  cancelInviteToDM() {
    this.commands.cancelInviteToDM();

    AppStore.dispatch({
      type: 'OutcomingInviteToDMCanceled',
    });
  },

  refuseInviteToDM() {
    this.commands.refuseInviteToDM();
  },

  getRoomList() {
    this.commands.getRoomList();
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
