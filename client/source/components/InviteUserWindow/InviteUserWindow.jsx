import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import { Window } from 'components/Window';
import { Button } from 'components/Button';

import './InviteUserWindow.scss';

export const InviteUserWindow = () => {
  const history = useHistory();
  const [msg, setMsg] = useState('');

  const onCopyLinkHandler = () => {
    const dummy = document.createElement('input');

    document.body.appendChild(dummy);
    dummy.value = window.location.origin;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    setMsg('Linked is copied!');
  };

  return (
    <Window className="invite-user-window">
      <p>This is invite user window</p>
      <p>{msg}</p>
      <Button onClick={onCopyLinkHandler}>Copy link</Button>
      <Button onClick={() => history.goBack()}>Close</Button>
    </Window>
  );
};
