import { AppStore } from 'store/store';
// import { Api } from 'api/Api';

export function RoomController(socketObj, commandsController) {
  return {
    socket: socketObj,
    commands: commandsController,

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

      this.commands.queryRoomList();
      this.commands.queryCurrentRoomName();

      this.clearUserList();
      this.commands.queryUserList();
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
        case 'UserConnected':
          this.commands.queryUserList();
          break;
        case 'YouJoinedRoom':
          this.updateAfterJoin();

          this.commands.queryCurrentRoomName();
          this.commands.queryUserList();
          this.commands.queryRoomList();
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
