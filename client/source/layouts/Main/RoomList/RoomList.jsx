import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { IconButton } from 'components/IconButton';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './RoomList.scss';
import { CreateRoomWindow } from 'components/CreateRoomWIndow';

export const RoomList = () => {
  const rooms = useSelector((appStore) => appStore.room.rooms);
  const [isCreateWindowOpen, switchCreateWindow] = useState(false);

  const onRoomClick = (room) => {
    Api.joinRoom(room)
      .then(() => {
        console.log('You joined room!');
        Api.queryCurrentRoomName();
      })
      .catch(() => console.log('Join error!'));
  };

  const onPlusBtnClick = () => switchCreateWindow(!isCreateWindowOpen);

  const onCloseCreateRoomWindow = () => {
    onPlusBtnClick();
  };

  return (
    <aside className="room-list">
      <div className="room-list__header">
        <span>Rooms</span>
        <IconButton onClick={onPlusBtnClick} icon={Icons.faPlus} />
      </div>
      <div className="room-list__list">
        {rooms.map((room) => (
          <div
            className="room-list__entry"
            key={room}
            onClick={() => onRoomClick(room)}
            aria-hidden
            title={room}
          >
            <div className="room-list__entry__name">{room}</div>
          </div>
        ))}
      </div>
      {isCreateWindowOpen && (
        <CreateRoomWindow onClose={onCloseCreateRoomWindow} />
      )}
    </aside>
  );
};
