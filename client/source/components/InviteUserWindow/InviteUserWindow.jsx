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

    setMsg('Link is copied to clipboard!');
  };

  return (
    <Window className="invite-user-window">
      <div>This is invite user window</div>
      <p className="invite-user-window__msg">{msg}</p>
      <Button onClick={onCopyLinkHandler} className="invite-user-window__copy-btn">Copy link</Button>
      <Button onClick={() => history.goBack()} className="invite-user-window__close">Close</Button>
    </Window>
  );
};
