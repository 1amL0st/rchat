import { createMessageElement} from './message.js'

export function Inbox() {
  this.inboxElement = document.getElementById('inbox-msgs');

  this.onNewMsg = (jsonMsg) => {
    console.log('onNewMsg = ', jsonMsg);
    
    let inbox = this.inboxElement;
    let msgElement = createMessageElement(jsonMsg);
    inbox.appendChild(msgElement);

    inbox.scroll(0, inbox.scrollHeight);
  }

  this.clear = () => {
    this.inboxElement.innerHTML = '';
  }
}