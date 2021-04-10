import React, { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import PropTypes from 'prop-types';
import classNames from 'class-names';

import { Api } from 'api/Api';
import { IconButton } from 'components/IconButton';
import { CreateRoomWindow } from 'components/CreateRoomWIndow';
import { MAIN_ROOM_NAME } from 'constants/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './RoomList.scss';

export const RoomList = ({ className, leftOffset }) => {
  const roomStore = useSelector((appStore) => appStore.room);
  const [isCreateWindowOpen, switchCreateWindow] = useState(false);
  const roomListRef = useRef();

  const { t } = useTranslation();

  const onRoomClick = (room) => {
    Api.joinRoom(room).catch(() => console.log('Join error!'));
  };

  const onPlusBtnClick = () => switchCreateWindow(!isCreateWindowOpen);

  const onCloseCreateRoomWindow = () => {
    onPlusBtnClick();
  };

  useEffect(() => {
    const stopEventPropagation = (e) => e.stopPropagation();

    roomListRef.current?.addEventListener('touchmove', stopEventPropagation);
    roomListRef.current?.addEventListener('mousemove', stopEventPropagation);

    const copy = roomListRef.current;

    return () => {
      copy?.removeEventListener('touchmove', stopEventPropagation);
      copy?.removeEventListener('mousemove', stopEventPropagation);
    };
  }, [roomListRef]);

  if (roomStore.roomName !== MAIN_ROOM_NAME) {
    return null;
  }

  return (
    <aside
      className={classNames('room-list', className)}
      style={{
        left: `${leftOffset}%`,
      }}
      ref={roomListRef}
    >
      <div className="room-list__header">
        <span>{t('words.rooms')}</span>
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

RoomList.defaultProps = {
  className: '',
};

RoomList.propTypes = {
  className: PropTypes.string,
  leftOffset: PropTypes.number.isRequired,
};
