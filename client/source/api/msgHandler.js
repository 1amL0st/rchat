import { AppStore } from 'store/store';

function buildMsg(msgJson) {
  const userLogin = AppStore.getState().user.login;
  return {
    ...msgJson,
    isOwn: msgJson.author === userLogin,
    author: msgJson.author === userLogin ? 'You' : msgJson.author,
  };
}

function serverMsgHandler(msgJson) {
  switch (msgJson.subType) {
    case 'FailedToSendMsg':
      break;
    default:
      console.warn('Unknown server msg handler subType ', msgJson);
      return;
  }

  if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: buildMsg(msgJson),
    });
  }
}

export function msgHandler(e) {
  const msgJson = JSON.parse(e.data);

  const handled = this.userController.msgHandler(msgJson)
    || this.roomController.msgHandler(msgJson)
    || this.inviteToDMController.msgHandler(msgJson);

  if (handled) {
    if (msgJson.author && msgJson.text) {
      AppStore.dispatch({
        type: 'AddMsg',
        message: buildMsg(msgJson),
      });
    }
    return;
  }

  if (msgJson.author === 'Server') {
    serverMsgHandler.call(this, msgJson);
    return;
  }
  if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: buildMsg(msgJson),
    });
    return;
  }

  console.log('Warn! UNHANDLED MESSAGE: ', msgJson);
}
