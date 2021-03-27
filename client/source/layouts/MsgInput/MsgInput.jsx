import React, { useState, useRef, useEffect } from 'react';

import { Socket } from 'api/Socket';

import { Button } from 'components/Button';

import './MsgInput.scss';

export const MsgInput = () => {
  const [message, setMessage] = useState('');
  const textAreaRef = useRef();

  const onSendBtn = () => {
    if (message.trim() !== 0) {
      Socket.socket.send(message);
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
    textAreaRef.current.focus();
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
