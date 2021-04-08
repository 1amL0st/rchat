export function Commands(socketObj) {
  return {
    socket: socketObj,

    sendMsg(msg) {
      this.socket.send(msg);
    },

    queryCurrentRoomName() {
      this.socket.send('/current_room');
    },

    queryUserList() {
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

    queryRoomList() {
      this.socket.send('/list_rooms');
    },

    queryRoomInfo() {
      this.queryCurrentRoomName();
      this.queryUserList();
      this.queryRoomList();
    },
  };
}
