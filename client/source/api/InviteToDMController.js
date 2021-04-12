import i18n from 'i18n/i18n';
import { AppStore } from 'store/store';

import { MAIN_ROOM_NAME } from 'constants/Api';
import { WaitingForWindowController } from './WaitingForWindowController';

export const STATES = {
  Came: 0,
  Failed: 1,
  Accepted: 2,
  Refused: 3,
  Processed: 4,
  Canceled: 5,
  Incoming: 6,
};

export function InviteToDMController(socketObj, commandsController) {
  return {
    socket: socketObj,
    commands: commandsController,

    inviteToDM(login) {
      const store = AppStore.getState();
      const userLogin = store.user.login;
      const { roomName } = store.room;

      if (userLogin !== login && roomName === MAIN_ROOM_NAME) {
        const request = `/invite_to_dm ${login}`;

        AppStore.dispatch({
          type: 'ShowOutcomingToDMRequest',
          guestLogin: login,
        });

        console.log('Request = ', request);
        this.socket.send(request);
      }
    },

    hideWindow() {
      AppStore.dispatch({
        type: 'HideInviteToDMWindow',
      });
    },

    refuseInviteToDM() {
      this.commands.refuseInviteToDM();
      this.hideWindow();
    },

    acceptInviteToDM() {
      this.commands.acceptInviteToDM();
    },

    cancelInviteToDM() {
      this.commands.cancelInviteToDM();

      AppStore.dispatch({
        type: 'OutcomingInviteToDMCanceled',
      });
    },

    msgHandler(msgJson) {
      switch (msgJson.subType) {
        case 'InviteToDMRequest':
          AppStore.dispatch({
            type: 'ShowIncomingToDMRequest',
            inviterLogin: msgJson.login,
          });
          break;
        case 'InviteUserToDMFail':
          AppStore.dispatch({
            type: 'InviteUserToDMFail',
            err: msgJson.reason,
          });
          break;
        case 'InviteToDMAccepted': {
          AppStore.dispatch({
            type: 'OutcomingInviteToDMAccepted',
          });

          const { guestLogin } = AppStore.getState().inviteDM;
          AppStore.dispatch({
            type: 'InviteUserToDMWaitForRoomCreate',
            waitingText: i18n.t('inviteToDM.waitForRoomCreation', {
              login: guestLogin,
            }),
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
        default:
          return false;
      }
      return true;
    },
  };
}
