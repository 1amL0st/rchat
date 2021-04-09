/* eslint react/forbid-prop-types: 0 */

import React from 'react';

import PropTypes from 'prop-types';

import { ServerMessage } from './ServerMessage';
import { UserMessage } from './UserMessage';

export const Message = ({ msgJson }) => (msgJson.author === 'Server' ? (
  <ServerMessage msgJson={msgJson} />
) : (
  <UserMessage msgJson={msgJson} />
));

Message.propTypes = {
  msgJson: PropTypes.any.isRequired,
};
