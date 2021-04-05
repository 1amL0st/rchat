import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

import './InviteUserWindow.scss';

export const InviteUserWindow = ({ onClose }) => {
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
    <ModalWindow className="invite-user-window" onClose={onClose} isOpen>
      <div>This is invite user window</div>
      <p className="invite-user-window__msg">{msg}</p>
      <Button
        onClick={onCopyLinkHandler}
        className="invite-user-window__copy-btn"
      >
        Copy link
      </Button>
      <Button onClick={onClose} className="invite-user-window__close">
        Close
      </Button>
    </ModalWindow>
  );
};

InviteUserWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
