import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { useWindowDimensions } from 'hooks/useWindowDimensions';
import { useSwipeEvent } from 'hooks/useSwipeEvent';

import { MAIN_ROOM_NAME } from 'constants/Api';

import { Chat } from './Chat';
import { RoomList } from './RoomList';
import { UserList } from './UserList';

import './Main.scss';

export const Main = () => {
  const { width: windowWidth } = useWindowDimensions();
  const [shouldDisplayRoomList, setShouldDisplayRoomList] = useState(true);

  const [roomList, setRoomList] = useState({
    leftOffset: -100,
    isOpen: false,
  });

  const [userList, setUserList] = useState({
    rightOffset: -100,
    isOpen: false,
  });

  const mainRef = useRef();
  const currentRoomName = useSelector((appStore) => appStore.room.roomName);

  useEffect(() => {
    setRoomList({
      leftOffset: -100,
      isOpen: false,
    });

    setUserList({
      isOpen: false,
      rightOffset: -100,
    });

    setShouldDisplayRoomList(currentRoomName === MAIN_ROOM_NAME);
  }, [currentRoomName]);

  const onSwipe = () => {
    // console.log('OnSwipe = ', offset);
  };

  const onSwipeStop = () => {
    setRoomList({
      leftOffset: roomList.isOpen ? 0 : -100,
      isOpen: roomList.isOpen,
    });

    setUserList({
      isOpen: userList.isOpen,
      rightOffset: userList.isOpen ? 0 : -100,
    });
  };

  const LIMIT = -50;
  const REV_LIMIT = -100 - LIMIT;

  // TODO: Refactor all this...

  const onSwipeMove = (offset) => {
    if (offset.x >= 0) {
      if (userList.isOpen) {
        const isOpen = userList.isOpen && userList.rightOffset > REV_LIMIT;
        setUserList({
          isOpen,
          rightOffset: isOpen
            ? userList.rightOffset - (offset.x * 100) / windowWidth
            : -100,
        });
      } else if (shouldDisplayRoomList) {
        const isOpen = roomList.isOpen || roomList.leftOffset > LIMIT;
        setRoomList({
          isOpen,
          leftOffset: isOpen
            ? 0
            : roomList.leftOffset + (offset.x * 100) / windowWidth,
        });
      }
    } else if (roomList.isOpen) {
      const isOpen = roomList.isOpen && roomList.leftOffset > REV_LIMIT;
      setRoomList({
        isOpen,
        leftOffset: isOpen
          ? roomList.leftOffset + (offset.x * 100) / windowWidth
          : -100,
      });
    } else {
      const isOpen = userList.isOpen || userList.rightOffset > LIMIT;
      setUserList({
        isOpen,
        rightOffset: !isOpen
          ? userList.rightOffset - (offset.x * 100) / windowWidth
          : 0,
      });
    }
  };

  useSwipeEvent(1000000, 0, onSwipe, onSwipeMove, onSwipeStop, mainRef);

  return (
    <main className="main" ref={mainRef}>
      {shouldDisplayRoomList && <RoomList leftOffset={roomList.leftOffset} />}
      <Chat />
      <UserList rightOffset={userList.rightOffset} />
    </main>
  );
};
