import React, { useRef, useState } from 'react';

import { useWindowDimensions } from 'hooks/useWindowDimensions';
import { useSwipeEvent } from 'hooks/useSwipeEvent';

import { Chat } from './Chat';
import { RoomList } from './RoomList';
import { UserList } from './UserList';

import './Main.scss';

export const Main = () => {
  const { width: windowWidth } = useWindowDimensions();

  const swipeOffset = windowWidth / 3;
  const screenCount = 3;

  const mainRef = useRef();
  const [screenNumber, setScreenNumber] = useState(1);

  const screens = [
    <RoomList key={0} />,
    <Chat key={1} />,
    <UserList key={2} />,
  ];

  function onSwipeCallback(distance) {
    if (distance.x <= -swipeOffset) {
      setScreenNumber((sn) => (sn === 0 ? screenCount - 1 : sn - 1));
    }
    if (distance.x >= swipeOffset) {
      setScreenNumber((sn) => (sn === screenCount - 1 ? 0 : sn + 1));
    }
  }

  useSwipeEvent(swipeOffset, Infinity, onSwipeCallback, mainRef);

  if (windowWidth > 800) {
    return (
      <main className="main" ref={mainRef}>
        {screens}
      </main>
    );
  }
  return (
    <main className="main" ref={mainRef}>
      {screens[screenNumber]}
    </main>
  );
};
