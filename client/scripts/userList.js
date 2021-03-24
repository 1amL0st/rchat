export function UserList() {
  this.userListElement = document.getElementById('user-list');
  this.users = [];

  this.show = (users) => {
    this.userListElement.innerHTML = '';
    this.users = users;

    for (const user of users) {
      const userEntry = document.createElement('div');
      userEntry.innerHTML = user;
      
      userEntry.classList.add('user-entry');
      this.userListElement.appendChild(userEntry)  
    }
  }

  this.userChangedLogin = (oldLogin, newLogin) => {
    this.users = this.users.map(user => {
      if (user == oldLogin) {
        return newLogin;
      }
      return user;
    });

    this.show(this.users);
  }
}