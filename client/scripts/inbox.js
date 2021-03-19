import { createMessageElement} from './message.js'

export async function inboxNewMsg(rawMsgText) {
  let inbox = document.getElementById('inbox-msgs');
  let msgElement = createMessageElement(rawMsgText);
  inbox.appendChild(msgElement);

  console.log('Scroll heighti = ', inbox.scrollHeight);
  inbox.scroll(0, inbox.scrollHeight);
}

export function inboxAddMessage(author, text) {
  const msg = JSON.stringify({
    author: author,
    text: text
  })
  inboxNewMsg(msg)
}