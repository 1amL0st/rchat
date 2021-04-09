import { useEffect, useRef } from 'react';

export function useSwipeEvent(
  targetHorzOffset,
  targetVertOffset,
  onSwipe,
  onSwipeMove,
  onSwipeStop,
  elementRef,
) {
  const isRegistered = useRef(false);
  const dir = useRef(null);
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

    const registerSwipe = (offset, clientX, clientY) => {
      if (dir.current === null) {
        if (offset.x > 0) {
          dir.current = 'right';
        } else {
          dir.current = 'left';
        }
      } else if (dir.current === 'right' && offset.x < 0) {
        dir.current = 'left';
      } else if (dir.current === 'left' && offset.x > 0) {
        dir.current = 'right';
      }

      onSwipeMove({
        x: clientX - lastPos.current.x,
        y: lastPos.current.y - clientY,
      });

      lastPos.current.x = clientX;
      lastPos.current.y = clientY;

      if (
        !isRegistered.current
        && (Math.abs(offset.x) > targetHorzOffset
          || Math.abs(offset.y) > targetVertOffset)
      ) {
        lastPos.current.x = clientX;
        lastPos.current.y = clientY;
        isRegistered.current = true;
        onSwipe(offset);
      }
    };

    const onTouchMove = (e) => {
      const x = e.changedTouches[0].clientX;
      const y = e.changedTouches[0].clientY;

      const offset = {
        x: x - lastPos.current.x,
        y: y - lastPos.current.y,
      };

      registerSwipe(
        offset,
        e.changedTouches[0].clientX,
        e.changedTouches[0].clientY,
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

        registerSwipe(offset, e.clientX, e.clientY);
      }
    };

    const onMouseLeave = () => {
      isRegistered.current = false;
      isDown.current = false;
      dir.current = false;
      onSwipeStop();
    };

    const onMouseUp = () => {
      isDown.current = false;
      isRegistered.current = false;
      dir.current = false;
      onSwipeStop();
    };

    // TODO: runs on each parent component rereneder and this looks very bad!
    // console.warn('UseSwipeEvent');

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
  }, [
    targetHorzOffset,
    targetVertOffset,
    onSwipe,
    elementRef,
    onSwipeStop,
    onSwipeMove,
  ]);
}
