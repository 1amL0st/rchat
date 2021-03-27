import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Message } from 'components/Message';

import './Inbox.scss';

export const Inbox = () => {
  const inboxRef = useRef();
  const messages = useSelector((appStore) => appStore.room.messages);

  useEffect(() => {
    inboxRef.current.scroll(0, inboxRef.current.scrollHeight);
  }, [messages]);

  const messageList = messages.map((msg) => (
    <Message key={Math.random() * 1000} author={msg.author} text={msg.text} />
  ));

  return (
    <div className="inbox" ref={inboxRef}>
      {messageList}
    </div>
  );
};
