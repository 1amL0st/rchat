import React from 'react';

import PropTypes from 'prop-types';
import { ModalWindow } from 'components/ModalWindow';

import './WaitingForWindow.scss';

export const WaitingForWindow = ({ text, isOpen }) => (
  <ModalWindow className="waiting-for-window" priority="High" isOpen={isOpen}>
    <div className="lds-ripple">
      <div />
      <div />
    </div>
    <div>{text}</div>
  </ModalWindow>
);

WaitingForWindow.defaultProps = {
  text: null,
  isOpen: false,
};

WaitingForWindow.propTypes = {
  text: PropTypes.string,
  isOpen: PropTypes.bool,
};
