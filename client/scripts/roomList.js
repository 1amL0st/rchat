export async function displayRoomList(jsonMsg, socket) {
  const list = document.getElementById('room-list');
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