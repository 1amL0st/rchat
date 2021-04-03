import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

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

  const onAccpectBtn = () => {
    dispatch({
      type: 'ShowWaitingForWindow',
      waitingText: 'You accepted DM request. Server is creating private room for you. Please, wait!',
    });

    Api.acceptInviteToDM();
  };

  return (
    <div className="invite-to-dm-window__content incoming-invite-window">
      <div className="incoming-invite-window__header">
        {`User'${invite.inviterLogin}'wants to DM with you...`}
      </div>
      <div className="incoming-invite-window__buttons">
        <Button onClick={onAccpectBtn}>Accept</Button>
        <Button onClick={onRefuseBtn}>Refuse</Button>
      </div>
    </div>
  );
};