import React from 'react';

import PropTypes from 'prop-types';

import { ServerMessage } from './ServerMessage';
import { UserMessage } from './UserMessage';

export const Message = ({ author, text, isOwn }) => (author === 'Server' ? (
  <ServerMessage text={text} />
) : (
  <UserMessage author={author} text={text} isOwn={isOwn} />
));

Message.propTypes = {
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
};
