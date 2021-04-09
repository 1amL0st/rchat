import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

import classNames from 'class-names';

import { Api } from 'api/Api';
import { IconButton } from 'components/IconButton';
import { CreateRoomWindow } from 'components/CreateRoomWIndow';
import { MAIN_ROOM_NAME } from 'constants/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './RoomList.scss';

// TODO: You can pass position of the list instead of style...
export const RoomList = ({ className, style }) => {
  const roomStore = useSelector((appStore) => appStore.room);
  const [isCreateWindowOpen, switchCreateWindow] = useState(false);
  const roomListRef = useRef();

  const onRoomClick = (room) => {
    Api.joinRoom(room).catch(() => console.log('Join error!'));
  };

  const onPlusBtnClick = () => switchCreateWindow(!isCreateWindowOpen);

  const onCloseCreateRoomWindow = () => {
    onPlusBtnClick();
  };

  useEffect(() => {
    const onTouchMove = (e) => {
      e.stopPropagation();
    };
    roomListRef.current?.addEventListener('touchmove', onTouchMove);
    return () => roomListRef.current?.removeEventListener('touchmove', onTouchMove);
  }, []);

  if (roomStore.roomName !== MAIN_ROOM_NAME) {
    return null;
  }

  return (
    <aside className={classNames('room-list', className)} style={style} ref={roomListRef}>
      <div className="room-list__header">
        <span>Rooms</span>
        <IconButton onClick={onPlusBtnClick} icon={Icons.faPlus} />
      </div>
      <div className="room-list__list">
        {roomStore.rooms.map((r) => (
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
