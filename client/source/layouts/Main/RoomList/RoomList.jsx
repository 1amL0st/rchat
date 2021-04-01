import React from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROUTES } from 'constants/Routes';
import { Api } from 'api/Api';
import { IconButton } from 'components/IconButton';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './RoomList.scss';

export const RoomList = () => {
  const rooms = useSelector((appStore) => appStore.room.rooms);
  const history = useHistory();

  const onRoomClick = (room) => {
    Api.joinRoom(room)
      .then(() => {
        console.log('You joined room!');
        Api.getCurrentRoomName();
      })
      .catch(() => console.log('Join error!'));
  };

  return (
    <aside className="room-list">
      <div className="room-list__header">
        <span>Rooms</span>
        <IconButton
          onClick={() => history.push(ROUTES.CreateRoom)}
          icon={Icons.faPlus}
        />
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
    </aside>
  );
};
