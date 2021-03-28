import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import './ModalWindow.scss';

export const ModalWindow = ({ className, children }) => (
  <div className={classNames(className, 'modal-window')}>{children}</div>
);

ModalWindow.defaultProps = {
  className: '',
};

ModalWindow.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
