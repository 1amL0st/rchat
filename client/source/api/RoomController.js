import { AppStore } from 'store/store';

export function RoomController(socketObj, commandsController) {
  return {
    socket: socketObj,
    commands: commandsController,

    clearUserList() {
      AppStore.dispatch({
        type: 'ClearUserList',
      });
    },

    clearInboxExceptLast() {
      AppStore.dispatch({
        type: 'ClearInboxExceptLast',
      });
    },

    clearInbox() {
      AppStore.dispatch({
        type: 'ClearInbox',
      });
    },

    updateAfterJoin() {
      this.clearInbox();
      this.clearUserList();
      this.commands.queryRoomInfo();
    },

    async joinRoom(room) {
      return new Promise((resolve) => {
        const { socket } = this;

        const handler = (e) => {
          const json = JSON.parse(e.data);
          if (json.subType === 'YouJoinedRoom') {
            socket.removeEventListener('message', handler);
            this.commands.queryCurrentRoomName();
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
          } else if (json.subType === 'RoomCreationFail') {
            reject(json.reason);
          }
        };

        socket.addEventListener('message', handler);
        socket.send(`/create_room ${roomName}`);
      });
    },

    msgHandler(msgJson) {
      if (msgJson.type === 'DataMsg') {
        return this.dataMsgHandler(msgJson);
      }

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
        case 'RoomCreationFail':
          break;
        case 'UserConnected':
          AppStore.dispatch({
            type: 'AddUser',
            login: msgJson.login,
          });
          break;
        case 'YouJoinedRoom':
          this.updateAfterJoin();
          this.commands.queryRoomInfo();
          break;
        case 'UserJoinedRoom':
          AppStore.dispatch({
            type: 'AddUser',
            login: msgJson.login,
          });
          break;
        default:
          return false;
      }

      return true;
    },

    dataMsgHandler(msgJson) {
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
          return false;
      }
      return true;
    },
  };
}
