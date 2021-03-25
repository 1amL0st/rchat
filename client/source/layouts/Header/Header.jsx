import React, { useState } from 'react';
import ReactModal from 'react-modal';

import { Button } from 'components/Button';

import './Header.scss';

export const Header = () => {
  const [leaving, setLeaving] = useState(false);

  const onLeaveBtnClick = () => {
    setLeaving(!leaving);
  };

  const onLeaveConfirm = () => {
    window.location.reload();
  };

  return (
    <div className="header">
      <ReactModal
        className="leave-modal-window"
        isOpen={leaving}
        contentLabel="Hello world"
        shouldCloseOnOverlayClick
        onRequestClose={() => setLeaving(false)}
        ariaHideApp={false}
      >
        <div>Are you sure you want leave? You'll lose all data!</div>
        <div className="leave-modal-window__controls">
          <Button size="small" onClick={onLeaveConfirm}>
            Yes
          </Button>
          <Button size="small" onClick={onLeaveBtnClick}>
            No
          </Button>
        </div>
      </ReactModal>
      <Button onClick={onLeaveBtnClick}>Leave</Button>
      <div>Login</div>
    </div>
  );
};

export default Header;
