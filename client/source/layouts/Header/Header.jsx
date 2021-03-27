import React, { useState } from 'react';

import { useSelector } from 'react-redux';
import ReactModal from 'react-modal';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './Header.scss';

export const Header = () => {
  const userLogin = useSelector((appStore) => appStore.userLogin);
  const chatName = useSelector((appStore) => appStore.chatName);

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
        <ModalWindow>
          <div>Are you sure you want leave? You'll lose all data!</div>
          <div className="leave-modal-window__controls">
            <Button size="small" onClick={onLeaveConfirm}>
              Yes
            </Button>
            <Button size="small" onClick={onLeaveBtnClick}>
              No
            </Button>
          </div>
        </ModalWindow>
      </ReactModal>
      <Button onClick={onLeaveBtnClick}>Leave</Button>
      <div>{chatName}</div>
      <div>{userLogin}</div>
    </div>
  );
};

export default Header;