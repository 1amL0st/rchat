export function RoomBar() {
  this.roomNameElement = document.getElementById('room-name');

  this.onRoomNameMsg = function (msgJSON) {
    this.roomNameElement.innerHTML = msgJSON.name;
  }
}