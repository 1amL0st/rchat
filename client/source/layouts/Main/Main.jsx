import React, { useEffect, useRef, useState } from 'react';

import { useWindowDimensions } from 'hooks/useWindowDimensions';
import { useSwipeEvent } from 'hooks/useSwipeEvent';

import { Chat } from './Chat';
import { RoomList } from './RoomList';
import { UserList } from './UserList';

import './Main.scss';

export const Main = () => {
  const { width: windowWidth } = useWindowDimensions();

  const distance = useSwipeEvent();

  const mainRef = useRef();

  const screenCount = 3;
  const [screenNumber, setScreenNumber] = useState(0);

  const screens = [
    <Chat key={1} />,
    <RoomList key={0} />,
    <UserList key={2} />,
  ];

  useEffect(() => {
    if (distance <= -100) {
      setScreenNumber((screenNumber) => ((screenNumber == 0) ? screenCount - 1 : screenNumber - 1));
    }
    if (distance >= 100) {
      setScreenNumber((screenNumber) => ((screenNumber == screenCount - 1) ? 0 : screenNumber + 1));
    }
  }, [distance, setScreenNumber]);

  if (windowWidth > 800) {
    return (
      <main className="main" ref={mainRef}>
        <RoomList key={0} />
        <Chat key={1} />
        <UserList key={2} />
      </main>
    );
  }
  return (
    <main className="main" ref={mainRef}>
      {screens[screenNumber]}
    </main>
  );
};
