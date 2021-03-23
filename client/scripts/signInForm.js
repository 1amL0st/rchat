export function hideSignInForm() {
  let window = document.getElementById('signin-window');
  window.classList.add(["popup-window--hidden"])

  let p = document.getElementById('sign-in-err');
  p.style.visibility = "hidden";
}

function showSignInErr(errText) {
  let p = document.getElementById('sign-in-err');
  p.innerHTML = errText;
  p.style.visibility = "visible";
}

export async function showSignInForm(gSocket) {
  return new Promise((resolve, reject) => {
    let window = document.getElementById('signin-window');
    window.classList.remove(["popup-window--hidden"])

    let loginInput = document.getElementsByClassName('login-form__input')[0];
    loginInput.focus();

    let signInBtn = document.getElementsByClassName('login-form__sign-in')[0];

    function successSignIn() {
      gSocket.removeEventListener('message', socketMsgHandler);
      document.getElementById('user-name-p').innerHTML = loginInput.value;
      hideSignInForm();
      resolve();
    }

    loginInput.addEventListener('keydown', (e) => {
      if (!e.shiftKey && e.code == 'Enter') {
        signInBtn.click();
        e.preventDefault();
      }
    })

    function socketMsgHandler(msg) {
      console.log('SocketMsgHandler = ', msg.data);
      if (msg.data == 'Login is set') {
        successSignIn();
        signInBtn.removeEventListener('click', signInBtnClickHandler);
      } else {
        showSignInErr(msg.data);
      }
    }

    gSocket.addEventListener('message', socketMsgHandler);

    async function signInBtnClickHandler() {
      gSocket.send("/login " + loginInput.value);
    }

    signInBtn.addEventListener('click', signInBtnClickHandler);
  })
}