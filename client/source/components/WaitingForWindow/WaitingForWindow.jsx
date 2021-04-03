import React from 'react';

import { useSelector } from 'react-redux';

import { Window } from 'components/Window';

import './WaitingForWindow.scss';

export const WaitingForWindow = () => {
  const waitingForText = useSelector(
    (appStore) => appStore.waitingFor.waitingText,
  );

  return (
    <Window className="waiting-for-window">
      <div className="lds-ripple">
        <div />
        <div />
      </div>
      {waitingForText}
    </Window>
  );
};
