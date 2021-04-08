export function Commands(socketObj) {
  return {
    socket: socketObj,

    sendMsg(msg) {
      this.socket.send(msg);
    },

    getCurrentRoomName() {
      this.socket.send('/current_room');
    },

    getUserList() {
      this.socket.send('/list_users');
    },

    acceptInviteToDM() {
      this.socket.send('/invite_to_dm_accept');
    },

    cancelInviteToDM() {
      this.socket.send('/invite_to_dm_cancel');
    },

    refuseInviteToDM() {
      this.socket.send('/invite_to_dm_refuse');
    },

    getRoomList() {
      this.socket.send('/list_rooms');
    },
  };
}