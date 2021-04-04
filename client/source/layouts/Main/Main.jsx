import React, { useEffect, useRef, useState } from 'react';

import { useSelector } from 'react-redux';
import { useWindowDimensions } from 'hooks/useWindowDimensions';

import { IconButton } from 'components/IconButton';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { METRICS } from 'constants/Metrics';
import { Chat } from './Chat';
import { RoomList } from './RoomList';
import { UserList } from './UserList';

import './Main.scss';

export const Main = () => {
  const { width: windowWidth } = useWindowDimensions();
  const screenCount = 3;

  const mainRef = useRef();
  const [screenNumber, setScreenNumber] = useState(1);
  const currentRoomName = useSelector((appStore) => appStore.room.roomName);

  useEffect(() => {
    setScreenNumber(1);
  }, [currentRoomName]);

  const SCREEN_NAMES = ['Rooms', 'Chat', 'Users'];

  const screens = [
    <RoomList key={0} />,
    <Chat key={1} />,
    <UserList key={2} />,
  ];

  const leftScreenNumber = (sn) => (sn === 0 ? screenCount - 1 : sn - 1);
  const rightScreenNumber = (sn) => (sn === screenCount - 1 ? 0 : sn + 1);

  const toLeftScreen = () => setScreenNumber(leftScreenNumber(screenNumber));
  const toRightScreen = () => setScreenNumber(rightScreenNumber(screenNumber));

  if (windowWidth > METRICS.mobileScreenWidth) {
    return (
      <main className="main" ref={mainRef}>
        {screens}
      </main>
    );
  }

  return (
    <main className="main" ref={mainRef}>
      <nav className="main__nav">
        <div className="main__nav__left" aria-hidden onClick={toLeftScreen}>
          <IconButton icon={Icons.faArrowLeft} />
          <span>{SCREEN_NAMES[leftScreenNumber(screenNumber)]}</span>
        </div>
        <div className="main__nav__right" aria-hidden onClick={toRightScreen}>
          <span>{SCREEN_NAMES[rightScreenNumber(screenNumber)]}</span>
          <IconButton icon={Icons.faArrowRight} />
        </div>
      </nav>
      {screens[screenNumber]}
    </main>
  );
};
