import { Inbox } from './inbox.js';
import { showSignInForm } from './signInForm.js';

const gInbox = new Inbox();

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

function setMsgInput() {
  msgTextArea.focus();
  
  msgTextArea.addEventListener('keydown', (e) => {
    if (!e.shiftKey && e.code == 'Enter') {
      onSendMsgBtn();
      e.preventDefault();
    }
  })
}

async function onSocketNewMsg(e) {
  console.log('onSocketNewMsg = ', e.data);

  if (e.data[0] == '{') {
    const json = JSON.parse(e.data);

    switch (json.type) {
      case "TextMsg":
        gInbox.onNewMsg(e.data);
        break;
      case 'LeaveNotify':
        gSocket.send('/list_users');
      case "JoinNotify":
        gInbox.onNewMsg(e.data);
        gSocket.send('/list_users');
        break;
      case 'UserList':
        displayUserList(json);
        break;
    }
  }
}

async function displayUserList(jsonMsg) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  let users = jsonMsg.users;
  console.log('users = ', users);

  for (const user of jsonMsg.users) {
    const userEntry = document.createElement('div');

    userEntry.innerHTML = user;
    userEntry.classList.add('user-entry');
    // userEntry.appendChild('')
    userList.appendChild(userEntry)
    // console.log('User ', user);
  }
}

async function start() {
  await createSocket();
  await showSignInForm(gSocket);
  gSocket.addEventListener('message', onSocketNewMsg);
  await setMsgInput();

  gSocket.send('/list_users');
}

(async function(){
  start();
})();

async function leaveCommand() {
  gInbox.clear();
  sendMsg('/leave');

  // TODO: Maybe i should avoid full page reload
  location.reload();

  // await createSocket();
  // await showSignInForm(gSocket);
  // await setMsgInput();
}

function onSendMsgBtn() {
  const msg = msgTextArea.value;
  if (msg.startsWith('/leave')) {
    leaveCommand();
  } else {
    sendMsg(msgTextArea.value);
  }
  msgTextArea.value = '';
}

document.getElementById('msg-text-area-send-btn').addEventListener('click', onSendMsgBtn);
document.getElementById('leave-btn').addEventListener('click', leaveCommand);

function sendMsg(msg) {
  gSocket.send(msg);
};