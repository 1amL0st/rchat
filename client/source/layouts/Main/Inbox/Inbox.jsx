import React from 'react';

import { Message } from 'components/Message';

import './Inbox.scss';

const TestMessages = [
  { author: 'Server', text: 'Some text' },
  { author: 'Server', text: 'Some text' },
  { author: 'Server', text: 'Some text' },
  { author: 'Server', text: 'Some text' },
];

export const Inbox = () => {
  const messages = TestMessages.map((msg) => (
    <Message key={Math.random() * 1000} author={msg.author} text={msg.text} />
  ));

  return <div className="inbox">{messages}</div>;
};
