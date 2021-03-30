import React from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { ROUTES } from 'constants/Routes';
import { Api } from 'api/Api';
import { Button } from 'components/Button';

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
      {/* <Button size="small" onClick={() => history.push(ROUTES.CreateRoom)}>
        Create room
      </Button> */}
      <div className="room-list__header">Rooms</div>
      {rooms.map((room) => (
        <div
          className="room-list__entry"
          key={room}
          onClick={() => onRoomClick(room)}
          aria-hidden
          title={room}
        >
          {room}
        </div>
      ))}
    </aside>
  );
};
