import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const IncomingRequestCanceledWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);
  const dispatch = useDispatch();

  const onOkBtn = () => {
    Api.inviteToDMController.hideWindow();
  };

  useEffect(() => {
    const keydownHandler = (e) => {
      if (e.code === 'Enter') {
        Api.inviteToDMController.hideWindow();
      }
    };

    window.addEventListener('keydown', keydownHandler);
    return () => window.removeEventListener('keydown', keydownHandler);
  }, [dispatch]);

  return (
    <ModalWindow
      onClose={onOkBtn}
      className="invite-to-dm-window__content incoming-invite-window"
      isOpen
    >
      <div className="incoming-invite-window__header">
        {`User '${invite.inviterLogin}' canceled DM with you...`}
      </div>
      <div className="incoming-invite-window__buttons">
        <Button onClick={onOkBtn}>Ok</Button>
      </div>
    </ModalWindow>
  );
};
