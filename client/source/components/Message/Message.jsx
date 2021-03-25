import React from 'react';
import PropTypes from 'prop-types';

import './Message.scss';

export const Message = ({ author, text }) => (
  <div className="message">
    <div className="message__author">{author}</div>
    <div className="message__text">{text}</div>
  </div>
);

Message.propTypes = {
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};
