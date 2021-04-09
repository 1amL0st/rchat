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

function buildMsg(msgJson) {
  if (msgJson.author !== 'Server') {
    return null;
  }

  // switch (msgJson.subType) {
  //   case 'UserJoinedRoom':
  //     return {
  //       author: 'Server',
  //       text: `User ${msgJson.login} joined room!`,
  //     };
  //   case 'UserConnected':
  //   {
  //     const userLogin = AppStore.getState().user.login;
  //     const text = (userLogin === msgJson.login) ?
  //  `${msgJson.login}, you're connected! Welcome to rchat!` : `User ${msgJson.login} connected!`;
  //     return {
  //       author: 'Server',
  //       text,
  //     };
  //   }
  //   default:
  //     break;
  // }

  return null;
}

export function MessageBuilder(msgJson) {
  if (msgJson.author !== 'Server' && msgJson.type === 'TextMsg') {
    return buildTextMsg(msgJson);
  }
  return buildMsg(msgJson);
}
