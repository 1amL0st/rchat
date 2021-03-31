import { useEffect, useRef } from 'react';

export function useSwipeEvent(
  targetHorzOffset,
  targetVertOffset,
  onSwipe,
  elementRef
) {
  const isRegistered = useRef(false);
  const isDown = useRef(false);
  const lastPos = useRef();

  useEffect(() => {
    const onTouchStart = (e) => {
      isRegistered.current = false;

      lastPos.current = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    };

    const doRegisterSwipe = (offset, clientX, clientY) => {
      if (
        !isRegistered.current &&
        (Math.abs(offset.x) > targetHorzOffset ||
          Math.abs(offset.y) > targetVertOffset)
      ) {
        lastPos.current.x = clientX;
        lastPos.current.y = clientY;
        isRegistered.current = true;
        onSwipe(offset);
      }
    };

    const onTouchMove = (e) => {
      console.log('e = ', e);
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;

      const offset = {
        x: x - lastPos.current.x,
        y: y - lastPos.current.y,
      };

      doRegisterSwipe(
        offset,
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY
      );
    };

    const onMouseDown = (e) => {
      isDown.current = true;
      lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (isDown.current) {
        const offset = {
          x: e.clientX - lastPos.current.x,
          y: e.clientY - lastPos.current.y,
        };

        doRegisterSwipe(offset, e.clientX, e.clientY);
      }
    };

    const onMouseLeave = () => {
      isRegistered.current = false;
      isDown.current = false;
    };

    const onMouseUp = () => {
      isDown.current = false;
      isRegistered.current = false;
    };

    const element = elementRef.current;

    element.addEventListener('touchstart', onTouchStart);
    element.addEventListener('touchmove', onTouchMove);
    element.addEventListener('touchcancel', onMouseUp);
    element.addEventListener('touchend', onMouseUp);

    element.addEventListener('mousedown', onMouseDown);
    element.addEventListener('mouseup', onMouseUp);
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('mouseleave', onMouseLeave);

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchcancel', onMouseUp);
      element.removeEventListener('touchend', onMouseUp);

      element.removeEventListener('mousedown', onMouseDown);
      element.removeEventListener('mouseup', onMouseUp);
      element.removeEventListener('mousemove', onMouseMove);
      element.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [targetHorzOffset, targetVertOffset, onSwipe, elementRef]);
}
