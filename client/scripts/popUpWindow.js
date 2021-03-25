export function showPopUpWindow(content) {

}

export function hidePopUpWindow() {
  const window = document.getElementById('popup-window');
  const content = document.getElementById('popup-window-content');

  window.classList.add(["popup-window--hidden"])
  content.innerHTML = '';
}