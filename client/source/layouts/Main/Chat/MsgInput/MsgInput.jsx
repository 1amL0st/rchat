import React, { useState, useRef, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { Api } from 'api/Api';

import './MsgInput.scss';

export const MsgInput = () => {
  const [message, setMessage] = useState('');
  const isLogged = useSelector((appStore) => appStore.user.isLogged);
  const textAreaRef = useRef();

  const focus = () => textAreaRef.current.focus();

  const onSendBtn = () => {
    if (message.trim()) {
      Api.sendMsg(message);
    }
    setMessage('');
    focus();
  };

  const onTextAreaKeydown = (e) => {
    if (!e.shiftKey && e.code === 'Enter') {
      onSendBtn();
      e.preventDefault();
    }
  };

  useEffect(() => {
    focus();
  }, [isLogged]);

  return (
    <div className="msg-input">
      <textarea
        ref={textAreaRef}
        className="msg-input__textarea"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={onTextAreaKeydown}
        maxLength={2048}
      />
      <button
        className="button msg-input__send-btn"
        onClick={onSendBtn}
        type="button"
        aria-label="Send"
      />
    </div>
  );
};
