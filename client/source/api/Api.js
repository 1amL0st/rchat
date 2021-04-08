import { MAIN_ROOM_NAME } from 'constants/Api';
import { msgHandler } from './msgHandler';
import { AppStore } from '../store/store';

import { WaitingForWindowController } from './WaitingForWindowController';
import { CriticalErrController } from './CriticalErrController';
import { UserController } from './UserController';
import { Commands } from './Commands';
import { RoomController } from './RoomController';

export const Api = {
  socket: null,

  waitingForWindowController: WaitingForWindowController,
  criticalErrController: CriticalErrController,
  userController: null,
  commands: null,
  roomController: null,

  async connect() {
    return new Promise((resolve) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
        + window.location.host
      }/ws/`;

      this.waitingForWindowController.showWaitingWindow(
        'Waiting for connection',
      );

      this.socket = new WebSocket(wsURI);

      // TODO: Detect if user is offline
      this.socket.onclose = () => {
        this.waitingForWindowController.hideWaitingWindow();
        this.criticalErrController.setErr(
          'Socket was closed! This is critical error!',
        );
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
        this.roomController = new RoomController(this.socket, this.commands);

        resolve();
      };
    });
  },

  sendMsg(msg) {
    this.commands.sendMsg(msg);
  },

  queryCurrentRoomName() {
    this.commands.queryCurrentRoomName();
  },

  queryUserList() {
    this.commands.queryUserList();
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

  queryRoomList() {
    this.commands.queryRoomList();
  },

  updateAfterJoin() {
    this.roomController.clearInboxExceptLast();

    this.commands.queryRoomList();
    this.commands.queryCurrentRoomName();

    this.roomController.clearUserList();
    this.commands.queryUserList();
  },

  async joinRoom(room) {
    return this.roomController.joinRoom(room);
  },

  async createRoom(roomName) {
    return this.roomController.createRoom(roomName);
  },
};
