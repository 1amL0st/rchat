import React from 'react';

import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { Window } from 'components/Window';

import './WaitingForWindow.scss';

export const WaitingForWindow = ({ customText }) => {
  const waitingForText = useSelector(
    (appStore) => appStore.waitingFor.waitingText
  );

  const text = customText ?? waitingForText;
  return (
    <Window className="waiting-for-window">
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      {text}
    </Window>
  );
};

WaitingForWindow.defaultProps = {
  customText: null,
};

WaitingForWindow.propTypes = {
  customText: PropTypes.string,
};
