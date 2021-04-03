import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';
import { WaitingForWindow } from 'components/WaitingForWindow';
import { Api } from 'api/Api';

import { OutcomingRequestRefused } from './OutcomingRequestRefused';
import { IncomingRequestWindow } from './IncomingRequest';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);
  const dispatch = useDispatch();

  let outcomingWindow;
  if (invite.isAccepted) {
    outcomingWindow = (
      <div className="request-accepted">Request is accepted!</div>
    );
  } else if (invite.isRefused) {
    outcomingWindow = <OutcomingRequestRefused />;
  } else {
    outcomingWindow = (
      <ModalWindow priority="High" isOpen>
        <WaitingForWindow customText="Waiting for user response" />
      </ModalWindow>
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