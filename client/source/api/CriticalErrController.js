import { AppStore } from 'store/store';

export const CriticalErrController = {
  setErr(errText) {
    AppStore.dispatch({
      type: 'SetCriticalErr',
      errText,
    });
  },
};