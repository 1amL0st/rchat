import React from 'react';

import { useSelector } from 'react-redux';

import { Window } from 'components/Window';
import { Button } from 'components/Button';

import './CriticalErrWindow.scss';

export const CriticalErrWindow = () => {
  const errText = useSelector((appStore) => appStore.criticalErr.errText);

  const onReloadBtn = () => {
    window.location.reload();
  };

  return (
    <Window className="critical-err-window">
      <p className="critical-err-window__text">{errText}</p>
      <Button onClick={onReloadBtn}>Reload page</Button>
    </Window>
  );
};
