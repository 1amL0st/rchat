import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ModalWindow } from 'components/ModalWindow';

import './WaitingForWindow.scss';

export const WaitingForWindow = ({ customText, isOpen }) => {
  const waitingForText = useSelector(
    (appStore) => appStore.waitingFor.waitingText,
  );

  const isWaiting = useSelector(
    (appStore) => appStore.waitingFor.isWaiting,
  );

  const text = customText ?? waitingForText;
  return (
    <ModalWindow className="waiting-for-window" priority="High" isOpen={isWaiting || isOpen}>
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      <div>
        {text}
      </div>
    </ModalWindow>
  );
};

WaitingForWindow.defaultProps = {
  customText: null,
  isOpen: false,
};

WaitingForWindow.propTypes = {
  customText: PropTypes.string,
  isOpen: PropTypes.bool,
};
