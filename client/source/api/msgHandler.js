import { AppStore } from 'store/store';
import { WaitingForWindowController } from './WaitingForWindowController';

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
    /* InviteToDM|DirectMessages code */
    case 'InviteToDMRequest':
      AppStore.dispatch({
        type: 'ShowIncomingToDMRequest',
        inviterLogin: msgJson.login,
      });
      break;
    case 'InviteUserToDMFail':
      AppStore.dispatch({
        type: 'InviteUserToDMFail',
        err: msgJson.err,
      });
      return;
    case 'InviteToDMAccepted': {
      AppStore.dispatch({
        type: 'OutcomingInviteToDMAccepted',
      });

      const { guestLogin } = AppStore.getState().inviteDM;
      AppStore.dispatch({
        type: 'ShowWaitCreateDMRoom',
        waitingText: `User ${guestLogin} accepted your DM invite. Server is creating private room for you. Please, wait!`,
      });
      break;
    }
    case 'InviteToDMCanceled':
      AppStore.dispatch({
        type: 'IncomingInviteToDMCanceled',
      });
      break;
    case 'InviteToDMRefused':
      AppStore.dispatch({
        type: 'OutcomingInviteToDMRefused',
      });
      break;
    case 'InviteToDMRoomCreated':
      AppStore.dispatch({
        type: 'HideInviteToDMWindow',
      });
      WaitingForWindowController.hideWaitingWindow();
      break;
    /** ****************************** */
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
    || this.roomController.msgHandler(msgJson);

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
  } else if (msgJson.author && msgJson.text) {
    AppStore.dispatch({
      type: 'AddMsg',
      message: buildMsg(msgJson),
    });
  }
}
