export function createMessageElement(msgText) {
  msgText = msgText.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
  const msgJSON = JSON.parse(msgText);

  const msg = document.createElement('div');

  const text = msgJSON.text.replace(/\\n/g, '<br>');
  msg.innerHTML = 
  `
  <div class="message__author">
    ${msgJSON.author}
  </div>
  <div class="message__text">
    ${text}
  </div>
  `

  msg.classList.add('message');

  return msg;
}