import { AppStore } from 'store/store';

export const WaitingForWindowController = {
  showWaitingWindow(text) {
    AppStore.dispatch({
      type: 'ShowWaitingForWindow',
      waitingText: text,
    });
  },

  hideWaitingWindow() {
    AppStore.dispatch({
      type: 'HideWaitingForWindow',
    });
  },
};