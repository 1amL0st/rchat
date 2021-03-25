export { showPopUpWindow, hidePopUpWindow } from './popUpWindow.js';

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

const DOM = generateDOM();

export async function createRoom() {
  return Promise((resolve, reject), {

  });
}