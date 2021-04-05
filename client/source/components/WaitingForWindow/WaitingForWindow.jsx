import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';

import { ModalWindow } from 'components/ModalWindow';

import './WaitingForWindow.scss';

export const WaitingForWindow = ({ className, isOpen, children }) => (
  <ModalWindow
    className={classNames('waiting-for-window', className)}
    priority="High"
    isOpen={isOpen}
  >
    <div className="lds-ripple">
      <div />
      <div />
    </div>
    {children}
  </ModalWindow>
);

WaitingForWindow.defaultProps = {
  className: null,
  isOpen: false,
};

WaitingForWindow.propTypes = {
  className: PropTypes.string,
  isOpen: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
