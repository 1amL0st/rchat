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

    console.log('JSON MSG = ', json);

    if (json.type === 'ServerMsg') {
      switch (json.subType) {
        case 'UserJoinedRoom':
          console.log('UserJoinedRoom.text = ', json.text);
          if (json.text.startsWith('You joined room')) {
            // NOTE: You can just leave 'main' room in the roomList
            gSocket.send('/current_room');
            gSocket.send('/list_rooms');
            gInbox.clear();
          }
          // NOTE: You can get new users' login here and just add it to userList
          gSocket.send('/list_users');
          break;
        case 'UserLeftRoom':
          // NOTE: You can get new users' login here and just add it to userList
          gSocket.send('/list_users');
          break;
        case 'UserConnected':
          // NOTE: You can get new users' login here and just add it to userList
          gSocket.send('/list_users');
          if (json.text === 'Someone connected!') {
            return;
          }
          break;
        case 'RoomCreationFail':
          break;
        case 'SomeoneConnected':
          gSocket.send('/list_users');
          break;
        default:
          console.log('Unknown msg subtype! Msg = ', json);
          break;
      }

      json.author = 'Server';
      const msg = JSON.stringify(json);
      gInbox.onNewMsg(msg);

      return;
    }

    switch (json.type) {
      case "TextMsg":
        gInbox.onNewMsg(e.data);
        break;
      case 'RoomListUpdate':
        gSocket.send('/list_rooms');
        break;
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
    console.log('Some non JSON msg = ', e.data);
  }
}

document.getElementById('invite-friend').addEventListener('click', function () {
  const dummy = document.createElement('input');

  document.body.appendChild(dummy);
  dummy.value = window.location.href;
  dummy.select();
  document.execCommand('copy');
  document.body.removeChild(dummy);

  alert("Link copied to clipboard!")

  gMsgTextArea.focus();
});

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

  // const msgText = JSON.stringify({
  //   'author': 'Server',
  //   'text': 'Some test message!'
  // });
  // gInbox.onNewMsg(msgText);

  // gSignInForm.hide();
  await gSignInForm.signIn(gSocket);
  gMsgTextArea.focus();

  updateData();

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