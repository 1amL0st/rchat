import React from 'react';
import { useHistory } from 'react-router-dom';

import ReactModal from 'react-modal';
import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const LeaveWindow = () => {
  const history = useHistory();

  const onYesBtn = () => {
    window.location.reload();
  };

  return (
    <ReactModal
      className="leave-modal-window"
      isOpen
      contentLabel="Hello world"
      shouldCloseOnOverlayClick
      onRequestClose={() => history.goBack()}
      ariaHideApp={false}
    >
      <ModalWindow>
        <div>Are you sure you want leave? You'll lose all data!</div>
        <div className="leave-modal-window__controls">
          <Button size="small" onClick={onYesBtn}>
            Yes
          </Button>
          <Button size="small" onClick={() => history.goBack()}>
            No
          </Button>
        </div>
      </ModalWindow>
    </ReactModal>
  );
};
