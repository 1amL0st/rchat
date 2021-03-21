import { createMessageElement} from './message.js'

export function Inbox() {
  this.inboxElement = document.getElementById('inbox-msgs');

  this.onNewMsg = (rawMsgText) => {
    console.log('onNewMsg = ', rawMsgText);
    
    let inbox = this.inboxElement;
    let msgElement = createMessageElement(rawMsgText);
    inbox.appendChild(msgElement);

    inbox.scroll(0, inbox.scrollHeight);
  }

  this.clear = () => {
    this.inboxElement.innerHTML = '';
  }
}