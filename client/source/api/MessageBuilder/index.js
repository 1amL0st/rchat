/* eslint react/destructuring-assignment: 0 */

import { AppStore } from 'store/store';

function buildTextMsg(msgJson) {
  const userLogin = AppStore.getState().user.login;
  return {
    ...msgJson,
    isOwn: msgJson.author === userLogin,
    author: msgJson.author === userLogin ? 'You' : msgJson.author,
  };
}

export function MessageBuilder(msgJson) {
  if (msgJson.author !== 'Server' && msgJson.type === 'TextMsg') {
    return buildTextMsg(msgJson);
  }
  return null;
}
