import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import i18n from 'i18next';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

export const OutcomingRequestRefused = () => {
  const dispatch = useDispatch();
  const guestLogin = useSelector((appStore) => appStore.inviteDM.guestLogin);

  const hideWindow = () => {
    dispatch({
      type: 'HideInviteToDMWindow',
    });
  };

  return (
    <ModalWindow
      onClose={hideWindow}
      className="invite-to-dm-window__content request-refused-window"
      isOpen
    >
      <div className="request-refused-window__header">
        {i18n.t('inviteToDM.outcomingRequestRefused', {
          login: guestLogin,
        })}
      </div>
      <Button className="request-refused-window__ok-btn" onClick={hideWindow}>
        Ok
      </Button>
    </ModalWindow>
  );
};
