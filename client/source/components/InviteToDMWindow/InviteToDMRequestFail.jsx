import React from 'react';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

import { useSelector, useDispatch } from 'react-redux';

export const InviteToDMRequestFail = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  const dispatch = useDispatch();

  const hideWindow = () => {
    dispatch({
      type: 'HideErrWindow',
    });
  };

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
