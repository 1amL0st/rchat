export function User() {
  this.login = '';
  this.userNameElement = document.getElementById('user-name-p');

  this.setLogin = (login) => {
    this.login = login;
    this.userNameElement.innerHTML = login;
  }
}