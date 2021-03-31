import React from 'react';
import classNames from 'class-names';

import PropTypes from 'prop-types';

import './Message.scss';

export const Message = ({ author, text, isOwn }) => (
  <div
    className={classNames('message', {
      'message--own': isOwn,
    })}
  >
    <div className="message__author">{author}</div>
    <div className="message__text">{text}</div>
  </div>
);

Message.propTypes = {
  author: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  isOwn: PropTypes.bool.isRequired,
};
