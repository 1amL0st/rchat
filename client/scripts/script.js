import { Inbox } from './inbox.js';
import { SignInForm } from './signInForm.js';
import { UserList } from './userList.js';
import { MsgTextArea } from './msgTextArea.js';
import { RoomBar } from './roomBar.js';
import { RoomList } from './roomList.js';
import { User } from './user.js';

const gUser = new User();
let gUserList = new UserList();
let gRoomList = null;
let gMsgTextArea = new MsgTextArea(onSendMsg);
let gInbox = new Inbox();
let gRoomBar = new RoomBar();
let gSignInForm = null;
let gUserLogin = "";

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

function handleServerMsg(json) {
  switch (json.subType) {
    case 'LoginChangeNotify':
      gUserList.userChangedLogin(json.oldLogin, json.newLogin);
      break;
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
    case 'LoggingSuccess':
      gUserList.userChangedLogin(gUserLogin, json.login);
      gUser.setLogin(json.login);
      return;
    case 'LogginFailed':
      return;
    default:
      console.log('Unknown ServerMsg subtype! Msg = ', json);
      break;
  }

  json.author = 'Server';
  const msg = JSON.stringify(json);
  gInbox.onNewMsg(msg);
}

function handleDataMsg(json) {
  switch (json.subType) {
    case 'UserList':
      console.log('json = ', json);
      gUserList.show(json.users);
      break;
    case 'CurRoom':
      // console.log('curRoom = ', json);
      gRoomBar.onRoomNameMsg(json);
      break;
    case 'RoomList':
      gRoomList.displayRoomList(json, gSocket);
      break;
    default:
      console.warn("Unkown DataMsg subtype! Msg = ", json);
      break;
  }
}

function handleDataChanged(rawMsg, json) {
  switch (json.subType) {
    case 'RoomListUpdate':
      gSocket.sendMsg('/list_rooms');
      break;
    default: 
      console.warn("Unkown DataChanged subtype! Msg = ", json);
      break;
  }
}

async function onSocketNewMsg(e) {
  const json = JSON.parse(e.data);
  console.log('JSON MSG = ', json);

  if (json.type === 'ServerMsg') {
    handleServerMsg(json);
  } else if (json.type == 'DataMsg') {
    handleDataMsg(json);
  } else if (json.type == 'DataChanged') {
    handleDataChanged(e.data, json);
  } else {
    gInbox.onNewMsg(e.data);
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
  const login = await gSignInForm.signIn(gSocket);
  gUser.setLogin(login);
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