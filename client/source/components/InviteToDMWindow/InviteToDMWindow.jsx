import React from 'react';

import { useSelector } from 'react-redux';

import { WaitingForWindow } from 'components/WaitingForWindow';
import { Button } from 'components/Button';

import { OutcomingRequestRefused } from './OutcomingRequestRefused';
import { IncomingRequestWindow } from './IncomingRequest';
import { InviteToDMRequestFail } from './InviteToDMRequestFail';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  const onCancelRequest = () => {
    console.log('OnCancelRequest!');
  };

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
      className="invite-to-dm-wait-response"
      isOpen={invite.guestLogin !== ''}
    >
      <div className="invite-to-dm-window__content">
        {invite.waitingText}
        <Button onClick={onCancelRequest}>Cancel</Button>
      </div>
    </WaitingForWindow>
  );
};
