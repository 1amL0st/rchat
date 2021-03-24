export function SignInForm(socket) {
  this.socket = socket;

  this.signIn = async function() {
    return new Promise((resolve, reject) => {
      let gSocket = this.socket;

      let window = document.getElementById('signin-window');
      window.classList.remove(["popup-window--hidden"])
  
      let loginInput = document.getElementsByClassName('login-form__input')[0];
      loginInput.focus();
  
      let signInBtn = document.getElementsByClassName('login-form__sign-in')[0];
  
      const successSignIn = () => {
        gSocket.removeEventListener('message', socketMsgHandler);
        document.getElementById('user-name-p').innerHTML = loginInput.value;
        this.hide();
        resolve();
      }
  
      loginInput.addEventListener('keydown', (e) => {
        if (!e.shiftKey && e.code == 'Enter') {
          signInBtn.click();
          e.preventDefault();
        }
      })
  
      const socketMsgHandler = (msg) => {
        console.log('SocketMsgHandler = ', msg.data);
        if (msg.data == 'Login is set') {
          successSignIn();
          signInBtn.removeEventListener('click', signInBtnClickHandler);
        } else {
          this.showError(msg.data);
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