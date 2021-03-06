import { msgHandler } from './msgHandler';

import { WaitingForWindowController } from './WaitingForWindowController';
import { CriticalErrController } from './CriticalErrController';
import { UserController } from './UserController';
import { Commands } from './Commands';
import { RoomController } from './RoomController';
import { InviteToDMController } from './InviteToDMController';

export const Api = {
  socket: null,
  isOffline: false,

  waitingForWindowController: WaitingForWindowController,
  criticalErrController: CriticalErrController,
  userController: null,
  commands: null,
  roomController: null,
  inviteToDMController: null,

  async connect() {
    return new Promise((resolve) => {
      const wsURI = `${
        (window.location.protocol === 'https:' ? 'wss://' : 'ws://')
        + window.location.host
      }/ws/`;

      this.waitingForWindowController.showWaitingWindow();

      this.socket = new WebSocket(wsURI);

      this.socket.onclose = () => {
        this.waitingForWindowController.hideWaitingWindow();
      };

      this.socket.onerror = () => {
        this.waitingForWindowController.hideWaitingWindow();

        // TODO: Looks like this doesn't work on server...
        const err = this.isOffline
          ? "Looks like you're offline"
          : 'Unkown error!';
        this.criticalErrController.setErr(`Socket was closed! ${err}`);
      };

      this.socket.onopen = () => {
        this.waitingForWindowController.hideWaitingWindow();
        this.socket.addEventListener('message', msgHandler.bind(this));

        this.userController = new UserController(this.socket);
        this.commands = new Commands(this.socket);
        this.roomController = new RoomController(this.socket, this.commands);
        this.inviteToDMController = new InviteToDMController(
          this.socket,
          this.commands,
        );

        resolve();
      };

      window.addEventListener('offline', () => {
        this.isOffline = true;
        this.criticalErrController.setErr("You're offline!");
      });
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
