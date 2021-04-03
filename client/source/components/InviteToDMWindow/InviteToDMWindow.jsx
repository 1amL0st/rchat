import React from 'react';

import { useSelector } from 'react-redux';

import { ModalWindow } from 'components/ModalWindow';
import { WaitingForWindow } from 'components/WaitingForWindow';

import { OutcomingRequestRefused } from './OutcomingRequestRefused';
import { IncomingRequestWindow } from './IncomingRequest';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  if (!(invite.came && !invite.processed)) {
    return null;
  }

  if (invite.isIncoming) {
    return <IncomingRequestWindow />;
  }

  if (invite.isAccepted) {
    return (
      <div className="request-accepted">Request is accepted!</div>
    );
  } if (invite.isRefused) {
    return (
      <OutcomingRequestRefused />
    );
  }
  return (
    <WaitingForWindow customText="Waiting for user response" isOpen={invite.guestLogin !== ''} />
  );

  // return (
  //   <ModalWindow
  //     isOpen={invite.came && !invite.processed}
  //     className="invite-to-dm-window"
  //   >
  //     {invite.isIncoming ? (
  //       <IncomingRequestWindow />
  //     ) : (
  //       <div className="outcoming">{outcomingWindow}</div>
  //     )}
  //   </ModalWindow>
  // );
};
