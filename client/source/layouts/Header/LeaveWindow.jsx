import React from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';
import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const LeaveWindow = ({ onClose, isOpen }) => {
  const onYesBtn = () => {
    window.location.reload();
  };

  return (
    <ReactModal
      className="leave-modal-window"
      isOpen={isOpen}
      contentLabel="Hello world"
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      ariaHideApp={false}
    >
      <ModalWindow>
        <div>Are you sure you want leave? You'll lose all data!</div>
        <div className="leave-modal-window__controls">
          <Button size="small" onClick={onYesBtn}>
            Yes
          </Button>
          <Button size="small" onClick={onClose}>
            No
          </Button>
        </div>
      </ModalWindow>
    </ReactModal>
  );
};

LeaveWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};
