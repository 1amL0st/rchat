import React from 'react';

import { useSelector } from 'react-redux';
import i18n from 'i18next';

import { Api } from 'api/Api';
import { STATES } from 'api/InviteToDMController';

import { WaitingForWindow } from 'components/WaitingForWindow';
import { Button } from 'components/Button';

import { OutcomingRequestRefused } from './OutcomingRequestRefused';
import { IncomingRequestWindow } from './IncomingRequest';
import { InviteToDMRequestFail } from './InviteToDMRequestFail';
import { IncomingRequestCanceledWindow } from './IncomingRequestCanceled';

import './InviteToDMWindow.scss';

export const InviteToDMWindow = () => {
  const invite = useSelector((appStore) => appStore.inviteDM);

  const onCancelRequest = () => {
    Api.inviteToDMController.cancelInviteToDM();
  };

  switch (invite.state) {
    case STATES.Incoming:
      return <IncomingRequestWindow />;
    case STATES.Failed:
      return <InviteToDMRequestFail />;
    case STATES.Canceled:
      return <IncomingRequestCanceledWindow />;
    case STATES.Refused:
      return <OutcomingRequestRefused />;
    case STATES.Processed:
      return null;
    default:
      break;
  }

  return (
    <WaitingForWindow
      className="invite-to-dm-wait-response"
      isOpen={invite.guestLogin !== ''}
    >
      <div className="invite-to-dm-window__content">
        {invite.waitingText}
        <Button onClick={onCancelRequest}>{i18n.t('words.cancel')}</Button>
      </div>
    </WaitingForWindow>
  );
};
