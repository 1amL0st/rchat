export async function displayUserList(jsonMsg) {
  const userList = document.getElementById('user-list');
  userList.innerHTML = '';

  let users = jsonMsg.users;
  console.log('users = ', users);

  for (const user of jsonMsg.users) {
    const userEntry = document.createElement('div');
    userEntry.innerHTML = user;
    
    userEntry.classList.add('user-entry');
    userList.appendChild(userEntry)
  }
}