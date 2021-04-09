import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';

import './UserMessage.scss';

export const UserMessage = ({ msgJson }) => {
  const { author, text, isOwn } = msgJson;
  return (
    <div
      className={classNames('user-message', 'message', {
        'user-message--own': isOwn,
      })}
    >
      <div className="user-message__author">{author}</div>
      <div className="user-message__text">{text}</div>
    </div>
  );
};

UserMessage.propTypes = {
  msgJson: PropTypes.shape({
    author: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    isOwn: PropTypes.bool.isRequired,
  }).isRequired,
};
