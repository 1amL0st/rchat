import React from 'react';

import PropTypes from 'prop-types';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const LeaveWindow = ({ onClose }) => {
  const onYesBtn = () => window.location.reload();

  return (
    <ModalWindow className="leave-window" onClose={onClose} isOpen>
      <div>
        Are you sure you want leave?
        <br />
        You'll lose all data!
      </div>
      <div className="leave-window__controls">
        <Button size="small" onClick={onYesBtn}>
          Yes
        </Button>
        <Button size="small" onClick={onClose}>
          No
        </Button>
      </div>
    </ModalWindow>
  );
};

LeaveWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
