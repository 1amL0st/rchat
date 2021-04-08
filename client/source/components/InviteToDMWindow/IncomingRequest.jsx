import React, { useEffect, useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

import { Api } from 'api/Api';

export const IncomingRequestWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);
  const dispatch = useDispatch();

  const onRefuseBtn = () => {
    Api.refuseInviteToDM();

    dispatch({
      type: 'HideInviteToDMWindow',
    });
  };

  const onAccpectBtn = useCallback(() => {
    Api.waitingForWindowController.showWaitingWindow(
      'You accepted DM request. Server is creating private room for you. Please, wait!',
    );
    Api.acceptInviteToDM();
  }, [dispatch]);

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.code === 'Enter') onAccpectBtn();
    };

    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, [onAccpectBtn]);

  return (
    <ModalWindow
      onClose={onRefuseBtn}
      className="invite-to-dm-window__content incoming-invite-window"
      isOpen
    >
      <div className="incoming-invite-window__header">
        {`User '${invite.inviterLogin}' wants to DM with you...`}
      </div>
      <div className="incoming-invite-window__buttons">
        <Button onClick={onAccpectBtn}>Accept</Button>
        <Button onClick={onRefuseBtn}>Refuse</Button>
      </div>
    </ModalWindow>
  );
};
