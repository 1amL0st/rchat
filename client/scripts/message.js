export function createMessageElement(msgText) {
  console.log('MsgText = ', msgText);
  msgText = msgText.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
  console.log('MsgText = ', msgText);
  const msgJSON = JSON.parse(msgText);

  const msg = document.createElement('div');

  const text = msgJSON.text.replace(/\\n/g, '<br>');
  msg.innerHTML = 
  `
  <div class="message__author">
    ${msgJSON.author}
  </div>
  <div class="message__text">
    <p>${text}</p>
  </div>
  `

  msg.classList.add('message');
  // msg.innerHTML = `${msgJSON.author}: ${msgJSON.text}`;

  return msg;
}