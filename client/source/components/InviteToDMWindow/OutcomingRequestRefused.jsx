import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

export const OutcomingRequestRefused = () => {
  const dispatch = useDispatch();
  const guestLogin = useSelector((appStore) => appStore.inviteDM.guestLogin);

  const onRefuseFormBtnClick = () => {
    dispatch({
      type: 'HideInviteToDMWindow',
    });
  };

  return (
    <ModalWindow
      className="invite-to-dm-window__content request-refused-window"
      isOpen
    >
      <div className="request-refused-window__header">
        {`User ${guestLogin} refused your request!`}
      </div>
      <Button
        className="request-refused-window__ok-btn"
        onClick={onRefuseFormBtnClick}
      >
        Ok
      </Button>
    </ModalWindow>
  );
};
