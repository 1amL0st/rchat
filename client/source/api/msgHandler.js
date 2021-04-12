import { AppStore } from 'store/store';
import { TranslateMessage } from 'i18n/MessageTranslator';
import { MessageBuilder } from './MessageBuilder';

export function msgHandler(e) {
  let msgJson = JSON.parse(e.data);
  console.log('msgJson = ', msgJson);
  msgJson = TranslateMessage(msgJson);

  const handled = this.userController.msgHandler(msgJson)
    || this.roomController.msgHandler(msgJson)
    || this.inviteToDMController.msgHandler(msgJson);

  if (handled || msgJson.type === 'TextMsg') {
    const msg = MessageBuilder(msgJson);
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
