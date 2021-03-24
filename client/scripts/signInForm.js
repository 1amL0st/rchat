export function SignInForm(socket) {
  this.socket = socket;

  this.signIn = async () => {
    return new Promise((resolve, reject) => {
      let gSocket = this.socket;

      let window = document.getElementById('signin-window');
      window.classList.remove(["popup-window--hidden"])
  
      let loginInput = document.getElementsByClassName('login-form__input')[0];
      loginInput.focus();
  
      let signInBtn = document.getElementsByClassName('login-form__sign-in')[0];
  
      const successSignIn = () => {
        gSocket.removeEventListener('message', socketMsgHandler);
        this.hide();
        resolve(loginInput.value);
      }
  
      loginInput.addEventListener('keydown', (e) => {
        if (!e.shiftKey && e.code == 'Enter') {
          signInBtn.click();
          e.preventDefault();
        }
      })
  
      const socketMsgHandler = (msg) => {
        const json = JSON.parse(msg.data);
        console.log('SocketMsgHandler = ', msg.data);

        if (json.type == 'ServerMsg' && json.subType == 'LoggingSuccess') {
          successSignIn();
          signInBtn.removeEventListener('click', signInBtnClickHandler);
        } else {
          this.showError(json.text);
        }
      }
  
      gSocket.addEventListener('message', socketMsgHandler);
  
      async function signInBtnClickHandler() {
        gSocket.send("/login " + loginInput.value);
      }
  
      signInBtn.addEventListener('click', signInBtnClickHandler);
    })
  }

  this.hide = function () {
    let window = document.getElementById('signin-window');
    window.classList.add(["popup-window--hidden"])

    let p = document.getElementById('sign-in-err');
    p.style.visibility = "hidden";
  }

  this.showError = function (errText) {
    let p = document.getElementById('sign-in-err');
    p.innerHTML = errText;
    p.style.visibility = "visible";
  }
}