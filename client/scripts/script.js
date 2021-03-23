import { Inbox } from './inbox.js';
import { SignInForm } from './signInForm.js';
import { displayUserList } from './userList.js';
import { MsgTextArea } from './msgTextArea.js';
import { RoomBar } from './roomBar.js';
import { RoomList } from './roomList.js';

let gRoomList = null;
let gMsgTextArea = new MsgTextArea(onSendMsg);
let gInbox = new Inbox();
let gRoomBar = new RoomBar();
let gSignInForm = null;

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

function updateData() {
  gSocket.send('/list_users');
  gSocket.send('/list_rooms');
  gSocket.send('/current_room');
}

async function onSocketNewMsg(e) {
  if (e.data[0] == '{') {
    const json = JSON.parse(e.data);

    switch (json.type) {
      case 'ServerMsg':
      case "TextMsg":
        gInbox.onNewMsg(e.data);
        break;
      case 'LeaveRoomNotify':
        gSocket.send('/list_users');
      case 'RoomListUpdate':
        gSocket.send('/list_rooms');
        break;
      case "JoinRoomNotify":
        gSocket.send('/list_rooms');
      case 'LoginChangeNotify':
        gInbox.onNewMsg(e.data);
        gSocket.send('/list_users');
        break;
      case 'UserList':
        displayUserList(json);
        break;
      case 'CurRoom':
        // console.log('curRoom = ', json);
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
    }
    updateData();
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
  gSignInForm = new SignInForm(gSocket);

  // gSignInForm.hide();
  await gSignInForm.signIn(gSocket);
  gMsgTextArea.focus();

  gSocket.send('/list_users');
  gSocket.send('/current_room');
  gSocket.send('/list_rooms');

  gSocket.addEventListener('message', onSocketNewMsg);
}

(async function(){
  start();
})();

async function leaveCommand() {
  location.reload();
}

document.getElementById('leave-btn').addEventListener('click', leaveCommand);

function sendMsg(msg) {
  gSocket.send(msg);
};