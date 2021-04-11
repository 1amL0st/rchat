import i18n from 'i18next';

function TranslateLoggingFailedMsg(msgJson) {
  if (msgJson.reason === 'Login must not be empty!') {
    return {
      ...msgJson,
      reason: i18n.t('logging.loginMustNotBeEmpty'),
    };
  } if (msgJson.reason === 'Login already exists!') {
    return {
      ...msgJson,
      reason: i18n.t('logging.loginExists'),
    };
  }
}

function TranslateRoomCreationFailMsg(msgJson) {
  if (msgJson.reason === 'Couldn\'t create room! A room with such name already exists!') {
    return {
      ...msgJson,
      reason: i18n.t('createRoom.roomNameExists'),
    };
  } if (msgJson.reason === 'Room name has wrong format!') {
    return {
      ...msgJson,
      reason: i18n.t('createRoom.roomNameWrongFormat'),
    };
  }
}

export function TranslateMessage(msgJson) {
  if (msgJson.author === 'Server') {
    switch (msgJson.subType) {
      case 'LoggingFailed':
        return TranslateLoggingFailedMsg(msgJson);
      case 'RoomCreationFail':
        return TranslateRoomCreationFailMsg(msgJson);
      default:
        break;
    }
  }

  return msgJson;
}