import { AppStore } from 'store/store';

import { MAIN_ROOM_NAME } from 'constants/Api';
import { WaitingForWindowController } from './WaitingForWindowController';

export function InviteToDMController(socketObj) {
  return {
    socket: socketObj,

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
            err: msgJson.err,
          });
          break;
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
        default:
          return false;
      }
      return true;
    },
  };
}
