import React from 'react';

import { Button } from 'components/Button';

import './MsgInput.scss';

export const MsgInput = () => {
  const onSendBtn = () => {
    console.log('Message is sent!');
  };

  return (
    <div className="msg-input">
      <textarea className="msg-input__textarea" rows={4} />
      <Button onClick={onSendBtn}>Send</Button>
    </div>
  );
};
