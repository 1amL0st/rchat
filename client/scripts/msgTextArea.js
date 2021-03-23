export function MsgTextArea(onSend) {
  this.textAreaElement = document.getElementById('msg-textarea');

  this.textAreaElement.addEventListener('keydown', (e) => {
    if (!e.shiftKey && e.code == 'Enter') {
      e.preventDefault();
      onSend(e.target.value);
    }
  });

  document.getElementById('msg-text-area-send-btn').addEventListener('click', onSendMsgBtn);

  function onSendMsgBtn() {
    onSend(this.textAreaElement.value);
    this.textAreaElement.value = '';
  }

  this.focus = function() {
    this.textAreaElement.focus();
  }
}