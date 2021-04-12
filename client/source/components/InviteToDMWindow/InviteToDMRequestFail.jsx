import React from 'react';
import { useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const InviteToDMRequestFail = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  const hideWindow = () => Api.inviteToDMController.hideWindow();

  return (
    <ModalWindow
      className="invite-to-dm-window__content invite-request-fail"
      onClose={hideWindow}
      isOpen
    >
      <div>{invite.errText}</div>
      <Button onClick={hideWindow}>Ok</Button>
    </ModalWindow>
  );
};
