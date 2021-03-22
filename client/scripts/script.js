import { Inbox } from './inbox.js';
import { showSignInForm, hideSignInForm } from './signInForm.js';
import { displayUserList } from './userList.js';
import { MsgTextArea } from './msgTextArea.js';
import { RoomBar } from './roomBar.js';
import { RoomList } from './roomList.js';

let gRoomList = null;
const gMsgTextArea = new MsgTextArea(onSendMsg);
const gInbox = new Inbox();
const gRoomBar = new RoomBar();

let gSocket = null;
let msgTextArea = document.getElementById('msg-textarea');

async function createSocket() {
  return new Promise((resolve, reject) => {
    const wsURI = (window.location.protocol === 'https:' ? 'wss://' : 'ws://') + window.location.host + '/ws/';

    gSocket = new WebSocket(wsURI);

    gSocket.onopen = function() {
      resolve();
      console.log("connected to " + wsURI);
    }

    gSocket.onclose = function(e) {
      console.log("connection closed (" + e.code + ")");
    }

    gSocket.onerror = function(e) {
      reject('Some error happened!');
    }
  })
}

async function onSocketNewMsg(e) {
  if (e.data[0] == '{') {
    const json = JSON.parse(e.data);

    switch (json.type) {
      case 'ServerMsg':
      case "TextMsg":
        gInbox.onNewMsg(e.data);
        break;
      case 'LeaveNotify':
        gSocket.send('/list_users');
      case "JoinNotify":
        gInbox.onNewMsg(e.data);
        gSocket.send('/list_users');
        gSocket.send('/list_rooms');
        gSocket.send('/current_room');
        break;
      case 'UserList':
        displayUserList(json);
        break;
      case 'CurRoom':
        console.log('curRoom = ', json);
        gRoomBar.onRoomNameMsg(json);
        break;
      case 'RoomList':
        gRoomList.displayRoomList(json, gSocket);
        break;
      default:
        console.warn("UNKNOWN MESSAGE TYPE = ", json.type);
        break;
    }
  } else {
    if (e.data === 'Join to room!') {
      gInbox.clear();
      gSocket.send('/current_room');
      gSocket.send('/list_rooms');
      gSocket.send('/list_users');
    }
    console.log('Some non JSON msg = ', e.data);
  }
}

function onSendMsg(msg) {
  if (msg.startsWith('/leave')) {
    leaveCommand();
  } else {
    sendMsg(msgTextArea.value);
  }
  msgTextArea.value = '';
}

async function start() {
  await createSocket();

  gRoomList = new RoomList(gSocket);
  await showSignInForm(gSocket);
  // hideSignInForm();

  gSocket.send('/list_users');
  gSocket.send('/current_room');

  gSocket.addEventListener('message', onSocketNewMsg);
}

(async function(){
  start();
})();

async function leaveCommand() {
  // gInbox.clear();
  // sendMsg('/leave');
  location.reload();
}

document.getElementById('leave-btn').addEventListener('click', leaveCommand);

function sendMsg(msg) {
  gSocket.send(msg);
};