import React from 'react';
import { useHistory } from 'react-router-dom';

import { Window } from 'components/Window';
import { Button } from 'components/Button';

export const LeaveWindow = () => {
  const history = useHistory();

  const onYesBtn = () => {
    window.location.reload();
  };

  const onClose = () => history.goBack();

  return (
    <Window className="leave-window" onShouldClose={onClose}>
      <div>
        Are you sure you want leave?
        <br />
        You'll lose all data!
      </div>
      <div className="leave-window__controls">
        <Button size="small" onClick={onYesBtn}>
          Yes
        </Button>
        <Button size="small" onClick={onClose}>
          No
        </Button>
      </div>
    </Window>
  );
};
