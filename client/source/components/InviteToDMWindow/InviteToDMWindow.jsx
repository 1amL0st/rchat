import React from 'react';

import { useSelector } from 'react-redux';

import { WaitingForWindow } from 'components/WaitingForWindow';

import { OutcomingRequestRefused } from './OutcomingRequestRefused';
import { IncomingRequestWindow } from './IncomingRequest';
import { InviteToDMRequestFail } from './InviteToDMRequestFail';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  if (!(invite.came && !invite.processed)) {
    return null;
  }

  if (invite.isFailed) {
    return <InviteToDMRequestFail />;
  }

  if (invite.isIncoming) {
    return <IncomingRequestWindow />;
  }

  if (invite.isRefused) {
    return <OutcomingRequestRefused />;
  }
  return (
    <WaitingForWindow
      customText="Waiting for user response"
      isOpen={invite.guestLogin !== ''}
    />
  );
};
