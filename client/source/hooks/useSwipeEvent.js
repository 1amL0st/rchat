import { useState, useEffect, useRef } from 'react';

export function useSwipeEvent() {
  const [distance, setDistance] = useState(0);
  const lastPos = useRef();

  useEffect(() => {
    const layout = window; // mainRef.current;

    const swipeStart = (e) => {
      lastPos.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    };

    const swipeStop = () => {
      // const [x, y] = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
      // const move = { x: Math.abs(x - lastPos.current.x), y: Math.abs(y - lastPos.current.y) };
    };

    const swipeMove = (e) => {
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;

      const move = {
        x: x - lastPos.current.x,
        y: y - lastPos.current.y,
      };

      setDistance(move.x);

      if (move.x >= -100 || move.x >= 100) {
        // e.preventDefault();
        // setScreenNumber((screenNumber + 1) % 3);
      }
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

  return distance;
}