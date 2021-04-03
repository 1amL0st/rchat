import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';
import { Api } from 'api/Api';
import { IncomingRequestWindow } from './IncomingRequest';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);
  const dispatch = useDispatch();

  const onRefuseFormBtnClick = () => {
    dispatch({
      type: 'HideInviteToDMWindow',
    });
  };

  let outcomingWindow;
  if (invite.isAccepted) {
    outcomingWindow = (
      <div className="request-accepted">Request is accepted!</div>
    );
  } else if (invite.isRefused) {
    outcomingWindow = (
      <div className="request-refused">
        <div>RequestIsRefused!</div>
        <Button onClick={onRefuseFormBtnClick}>Ok</Button>
      </div>
    );
  } else {
    outcomingWindow = (
      <div className="request-waiting">Request waiting!</div>
    );
  }

  return (
    <ModalWindow
      isOpen={invite.came && !invite.processed}
      className="invite-to-dm-window"
    >
      {invite.isIncoming ? (
        <IncomingRequestWindow />
      ) : (
        <div className="outcoming">
          {outcomingWindow}
        </div>
      )}
    </ModalWindow>
  );
};