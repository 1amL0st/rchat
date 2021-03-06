import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { Message } from 'components/Message';
import { MsgInput } from './MsgInput';

import './Chat.scss';

export const Chat = () => {
  const inboxRef = useRef();
  const messages = useSelector((appStore) => appStore.room.messages);

  useEffect(() => {
    inboxRef.current.scroll(0, inboxRef.current.scrollHeight);
  }, [messages]);

  const messageList = messages.map((msg) => (
    <Message
      key={msg.id}
      // author={msg.author}
      // text={msg.text}
      // isOwn={msg.isOwn}
      msgJson={msg}
    />
  ));

  return (
    <div className="chat">
      <div className="inbox" ref={inboxRef}>
        {messageList}
      </div>
      <MsgInput />
    </div>
  );
};
