import React, { useEffect, useCallback } from 'react';

import { useSelector } from 'react-redux';
import i18n from 'i18next';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

import { Api } from 'api/Api';

export const IncomingRequestWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  const onRefuseBtn = () => {
    Api.inviteToDMController.refuseInviteToDM();
  };

  const onAcceptBtn = useCallback(() => {
    Api.waitingForWindowController.showWaitingWindow(
      'You accepted DM request. Server is creating private room for you. Please, wait!',
    );
    Api.inviteToDMController.acceptInviteToDM();
  }, []);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.code === 'Enter') onAcceptBtn();
    };

    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, [onAcceptBtn]);

  return (
    <ModalWindow
      onClose={onRefuseBtn}
      className="invite-to-dm-window__content incoming-invite-window"
      isOpen
    >
      <div className="incoming-invite-window__header">
        {i18n.t('inviteToDM.incomingRequestText', {
          login: invite.inviterLogin,
        })}
      </div>
      <div className="incoming-invite-window__buttons">
        <Button onClick={onAcceptBtn}>{i18n.t('words.accept')}</Button>
        <Button onClick={onRefuseBtn}>{i18n.t('words.refuse')}</Button>
      </div>
    </ModalWindow>
  );
};
