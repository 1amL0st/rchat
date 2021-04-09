import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { IconButton } from 'components/IconButton';
import { MAIN_ROOM_NAME } from 'constants/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './RoomList.scss';
import { CreateRoomWindow } from 'components/CreateRoomWIndow';

export const RoomList = () => {
  const room = useSelector((appStore) => appStore.room);
  const [isCreateWindowOpen, switchCreateWindow] = useState(false);

  const onRoomClick = (room) => {
    Api.joinRoom(room).catch(() => console.log('Join error!'));
  };

  const onPlusBtnClick = () => switchCreateWindow(!isCreateWindowOpen);

  const onCloseCreateRoomWindow = () => {
    onPlusBtnClick();
  };

  if (room.roomName !== MAIN_ROOM_NAME) {
    return null;
  }

  return (
    <aside className="room-list">
      <div className="room-list__header">
        <span>Rooms</span>
        <IconButton onClick={onPlusBtnClick} icon={Icons.faPlus} />
      </div>
      <div className="room-list__list">
        {room.rooms.map((r) => (
          <div
            className="room-list__entry"
            key={r}
            onClick={() => onRoomClick(r)}
            aria-hidden
            title={r}
          >
            <div className="room-list__entry__name">{r}</div>
          </div>
        ))}
      </div>
      {isCreateWindowOpen && (
        <CreateRoomWindow onClose={onCloseCreateRoomWindow} />
      )}
    </aside>
  );
};
