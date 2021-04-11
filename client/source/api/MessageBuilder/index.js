import i18n from 'i18next';

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

  switch (msgJson.subType) {
    case 'UserConnected': {
      const userLogin = AppStore.getState().user.login;
      if (userLogin === msgJson.login) {
        return {
          author: 'Server',
          text: `${msgJson.login}, ${i18n.t('phrases.youAreConnected')}`,
        };
      }
      break;
    }
    default:
      break;
  }

  return null;
}

export function MessageBuilder(msgJson) {
  if (msgJson.author !== 'Server' && msgJson.type === 'TextMsg') {
    return buildTextMsg(msgJson);
  }
  return buildMsg(msgJson);
}
