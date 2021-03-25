import { showPopUpWindow, hidePopUpWindow } from './popUpWindow.js';

function generateDOM() {
  const container = document.createElement('div');
  container.id = 'sigin-window';
  container.classList.add('login-form');
  container.classList.add('flex-column');

  container.innerHTML = 
  `
    <input type="text" class="input login-form__input" placeholder="Enter login">
    <p id="sign-in-err" class="error-msg login-form__error"></p>
    <button class="button login-form__sign-in">Sign in</button>
  `

  return container;
}

function showError(errText) {
  let p = document.getElementById('sign-in-err');
  p.innerHTML = errText;
  p.style.visibility = "visible";
}

const DOM = generateDOM();

export async function signIn(socket) {
  return new Promise((resolve, _) => {
    showPopUpWindow(DOM);

    let gSocket = socket;

    let window = document.getElementById('signin-window');
    window.classList.remove(["popup-window--hidden"])

    let loginInput = document.getElementsByClassName('login-form__input')[0];
    loginInput.focus();

    let signInBtn = document.getElementsByClassName('login-form__sign-in')[0];
    const successSignIn = () => {
      gSocket.removeEventListener('message', socketMsgHandler);
      hidePopUpWindow();
      resolve(loginInput.value);
    }

    loginInput.addEventListener('keydown', (e) => {
      if (!e.shiftKey && e.code == 'Enter') {
        signInBtn.click();
        e.preventDefault();
      }
    });

    const socketMsgHandler = (msg) => {
      const json = JSON.parse(msg.data);
      console.log('SocketMsgHandler = ', msg.data);

      if (json.type == 'ServerMsg' && json.subType == 'LoggingSuccess') {
        successSignIn();
        signInBtn.removeEventListener('click', signInBtnClickHandler);
      } else {
        showError(json.text);
      }
    }

    gSocket.addEventListener('message', socketMsgHandler);

    async function signInBtnClickHandler() {
      gSocket.send("/login " + loginInput.value);
    }

    signInBtn.addEventListener('click', signInBtnClickHandler);
  })
}