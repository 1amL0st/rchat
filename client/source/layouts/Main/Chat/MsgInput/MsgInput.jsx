import React, { useState, useRef, useEffect } from 'react';

import { Api } from 'api/Api';
import { Button } from 'components/Button';

import './MsgInput.scss';

export const MsgInput = () => {
  const [message, setMessage] = useState('');
  // NOTE: This pre-focus doesn't work well on mobile
  // const textAreaRef = useRef();

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
    // Stop prefox, because this isn't a good solution on mobile
    // textAreaRef.current.focus();
  }, []);

  return (
    <div className="msg-input">
      <textarea
        // ref={textAreaRef}
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
