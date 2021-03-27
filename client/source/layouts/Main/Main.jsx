import React, { useEffect, useRef, useState } from 'react';

import { Inbox } from './Inbox';
import { RoomList } from './RoomList';
import { UserList } from './UserList';

import './Main.scss';

export const Main = () => {
  const lastPos = useRef();
  const mainRef = useRef();

  const [screenNumber, setScreenNumber] = useState(2);

  const screens = [
    <RoomList key={0} />,
    <Inbox key={1} />,
    <UserList key={2} />,
  ];

  useEffect(() => {
    const layout = mainRef.current;

    const swipeStart = (e) => {
      lastPos.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
      // console.log('swipeStart', e);
      // console.log('Swipe start!');
    };

    const swipeStop = (e) => {
      const [x, y] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      // const move = { x: Math.abs(x - lastPos.current.x), y: Math.abs(y - lastPos.current.y) };
    };

    const swipeMove = (e) => {
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;

      const move = {
        x: Math.abs(x - lastPos.current.x),
        y: Math.abs(y - lastPos.current.y),
      };

      if (move.x >= 100) {
        console.log('Swipe finished!');
        e.preventDefault();
        setScreenNumber((screenNumber + 1) % 3);
      }
      // console.log('e = ', e);
      // console.log('%d %d', x, y);
    };

    layout.addEventListener('touchstart', swipeStart);
    layout.addEventListener('touchcancel', swipeStop);
    layout.addEventListener('touchend', swipeStop);
    layout.addEventListener('touchmove', swipeMove);

    return () => {
      layout.removeEventListener('touchstart', swipeStart);
      layout.removeEventListener('touchcancel', swipeStop);
      layout.removeEventListener('touchend', swipeStop);
      layout.removeEventListener('touchmove', swipeMove);
    };
  });

  return (
    <main className="main" ref={mainRef}>
      {screens[screenNumber]}
    </main>
  );
};
