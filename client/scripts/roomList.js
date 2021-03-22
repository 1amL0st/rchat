export function RoomList(socket) {
  this.listElement = document.getElementById('room-list');

  const createRoomBtn = document.getElementById('create-room-btn');
  createRoomBtn.addEventListener('click', () => {
    const roomName = prompt("Enter room name");
    const msg = `/create_room ${roomName}`;
    socket.send(msg);
  });

  this.displayRoomList = function(jsonMsg, socket) {
    const list = this.listElement;
    list.innerHTML = '';

    for (const room of jsonMsg.rooms) {
      const roomEntry = document.createElement('div');
      roomEntry.innerHTML = room;

      roomEntry.addEventListener('click', () => {
        const msg = `/join ${room}`;
        socket.send(msg);
      });
      
      roomEntry.classList.add('room-entry');
      list.appendChild(roomEntry)
    }   
  }
}