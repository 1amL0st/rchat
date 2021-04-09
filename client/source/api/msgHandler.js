import { AppStore } from 'store/store';
import { MessageBuilder } from './MessageBuilder';

export function msgHandler(e) {
  const msgJson = JSON.parse(e.data);
  console.log('msgJson = ', msgJson);

  const handled = this.userController.msgHandler(msgJson)
    || this.roomController.msgHandler(msgJson)
    || this.inviteToDMController.msgHandler(msgJson);

  if (handled || msgJson.type === 'TextMsg') {
    const msg = MessageBuilder(msgJson);
    // console.log('MessageBuilded = ', msg);
    if (msg) {
      AppStore.dispatch({
        type: 'AddMsg',
        message: msg,
      });
    }
    return;
  }

  console.error('msgHandlerError! UNHANDLED MESSAGE: ', msgJson);
}
