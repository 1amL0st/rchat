import React from 'react';
import PropTypes from 'prop-types';

import './ModalWindow.scss';

export const ModalWindow = ({
  children,
}) => (
  <div className="modal-window">
    {children}
  </div>
);

ModalWindow.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
};