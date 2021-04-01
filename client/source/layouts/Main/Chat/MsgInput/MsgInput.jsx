import React, { useState, useRef, useEffect } from 'react';

import { Api } from 'api/Api';
import { Button } from 'components/Button';
import { METRICS } from 'constants/Metrics';

import './MsgInput.scss';

export const MsgInput = () => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef();

  const onSendBtn = () => {
    if (message.trim() !== 0) {
      Api.sendMsg(message);
    }
    setMessage('');
  };

  const onTextAreaKeydown = (e) => {
    if (!e.shiftKey && e.code === 'Enter') {
      onSendBtn();
      e.preventDefault();
    }
  };

  useEffect(() => {
    // This focus doesn't work well on mobile. Do this only for desktop
    if (window.innerWidth >= METRICS.mobileScreenWidth) {
      textAreaRef.current.focus();
    }
  }, []);

  return (
    <div className="msg-input">
      <textarea
        ref={textAreaRef}
        className="msg-input__textarea"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onTextAreaKeydown}
      />
      <Button onClick={onSendBtn}>Send</Button>
    </div>
  );
};
