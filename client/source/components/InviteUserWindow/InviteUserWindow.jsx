import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

import './InviteUserWindow.scss';

export const InviteUserWindow = ({ onClose }) => {
  const [msg, setMsg] = useState('');
  const { t } = useTranslation();

  const onCopyLinkHandler = () => {
    const dummy = document.createElement('input');

    document.body.appendChild(dummy);
    dummy.value = window.location.origin;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    setMsg(t('phrases.linkCopiedToClipboard'));
  };

  return (
    <ModalWindow className="invite-user-window" onClose={onClose} isOpen>
      <p className="invite-user-window__msg">{msg}</p>
      <Button
        onClick={onCopyLinkHandler}
        className="invite-user-window__copy-btn"
      >
        {t('phrases.copyLink')}
      </Button>
      <Button onClick={onClose} className="invite-user-window__close">
        {t('words.cancel')}
      </Button>
    </ModalWindow>
  );
};

InviteUserWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
