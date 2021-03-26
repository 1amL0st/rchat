import React, { useEffect, useRef, useState } from 'react';

import { Socket } from 'api/Socket';

import { Message } from 'components/Message';

import './Inbox.scss';

export const Inbox = () => {
  const inboxRef = useRef();
  const [messages, setMessages] = useState([]);

  const onNewSocketMsg = (e) => {
    const json = JSON.parse(e.data);
    json.text = json.text
      .replace(/\n/g, '\\\\n')
      .replace(/\r/g, '\\\\r')
      .replace(/\t/g, '\\\\t');
    setMessages([...messages, json]);
    inboxRef.current.scroll(0, inboxRef.current.scrollHeight);
  };

  useEffect(() => {
    Socket.socket.addEventListener('message', onNewSocketMsg);
    return () => {
      Socket.socket.removeEventListener('message', onNewSocketMsg);
    };
  }, [onNewSocketMsg]);

  const messageList = messages.map((msg) => (
    <Message key={Math.random() * 1000} author={msg.author} text={msg.text} />
  ));

  return (
    <div className="inbox" ref={inboxRef}>
      {messageList}
    </div>
  );
};
