import { inboxAddMessage, inboxNewMsg, clearInbox } from './inbox.js';

let gSocket = null;
let msgTextArea = document.getElementById('msg-textarea');

function hideSignInForm() {
  let window = document.getElementById('signin-window');
  window.classList.add(["popup-window--hidden"])

  let p = document.getElementById('sign-in-err');
  p.style.visibility = "hidden";
}

function showSignInErr() {
  let p = document.getElementById('sign-in-err');
  p.style.visibility = "visible";
}

async function showSignInForm() {
  return new Promise((resolve, reject) => {
    let window = document.getElementById('signin-window');
    window.classList.remove(["popup-window--hidden"])

    let loginInput = document.getElementsByClassName('login-form__input')[0];
    loginInput.focus();

    let signInBtn = document.getElementsByClassName('login-form__sign-in')[0];

    function successSignIn() {
      gSocket.removeEventListener('message', socketMsgHandler);
      gSocket.addEventListener('message', onSocketNewMsg);
      document.getElementById('user-name-p').innerHTML = loginInput.value;
      hideSignInForm();
      resolve();
    }

    function socketMsgHandler(msg) {
      // console.log('msg = ', msg);
      if (msg.data == 'Login is set') {
        successSignIn();
        signInBtn.removeEventListener('click', signInBtnClickHandler);
      } else if (msg.data == 'Login exists') {
        showSignInErr();
      }
    }

    gSocket.addEventListener('message', socketMsgHandler);

    async function signInBtnClickHandler() {
      gSocket.send("/login " + loginInput.value);
    }

    signInBtn.addEventListener('click', signInBtnClickHandler);
  })
}

function sendBtnClickHandler() {
  gSocket.send("/login " + msgTextArea.value);
}

async function onSocketNewMsg(e) {
  console.log('onSocketNewMsg = ', e.data);
  const text = e.data;
  if (text[0] == '{') {
    inboxNewMsg(text);
  }
}

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

(async function(){
  await createSocket();
  // gSocket.addEventListener('message', onSocketNewMsg);
  await showSignInForm();
  await setMsgInput();
})();

async function leaveCommand() {
  clearInbox();
  sendMsg('/leave');
  await createSocket();
  await showSignInForm();
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