import React from 'react';

import PropTypes from 'prop-types';

import './ServerMessage.scss';

export const ServerMessage = ({ msgJson }) => (
  <div className="server-message message">
    <span>{`Server: ${msgJson.text}`}</span>
  </div>
);

ServerMessage.propTypes = {
  msgJson: PropTypes.any.isRequired,
};
