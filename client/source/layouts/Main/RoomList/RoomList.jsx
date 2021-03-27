import React from 'react';
import { useSelector } from 'react-redux';

import './RoomList.scss';

export const RoomList = () => {
  const rooms = useSelector((appStore) => appStore.room.rooms);

  return (
    <aside className="room-list">
      {rooms.map((room) => (
        <div key={room}>{room}</div>
      ))}
    </aside>
  );
};
