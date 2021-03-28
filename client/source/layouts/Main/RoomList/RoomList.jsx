import React from 'react';
import { useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { Button } from 'components/Button';

import './RoomList.scss';

export const RoomList = () => {
  const rooms = useSelector((appStore) => appStore.room.rooms);

  const onRoomClick = (room) => {
    Api.joinRoom(room).then(() => {
      console.log('You joined room!');
      Api.getCurrentRoomName();
    }).catch(() => console.log('Join error!'));
  };

  return (
    <aside className="room-list">
      <Button size="small">Create room</Button>
      {rooms.map((room) => (
        <div
          className="room-list__entry"
          key={room}
          onClick={() => onRoomClick(room)}
          aria-hidden
        >
          {room}
        </div>
      ))}
    </aside>
  );
};
