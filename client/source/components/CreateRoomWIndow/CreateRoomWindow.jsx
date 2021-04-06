import React, { useState } from 'react';

import PropTypes from 'prop-types';

import { Api } from 'api/Api';
import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './CreateRoomWindow.scss';

export const CreateRoomWindow = ({ onClose }) => {
  const [roomName, setRoomName] = useState('');
  const [err, setErr] = useState('');

  const onCreateRoomBtn = () => {
    Api.createRoom(roomName)
      .then(() => {
        onClose();
      })
      .catch((e) => setErr(e));
  };

  const onKeyDown = (e) => {
    if (e.code === 'Enter') {
      onCreateRoomBtn();
    }
  };

  const inputRef = (input) => input?.focus();

  return (
    <ModalWindow className="create-room-window" onClose={onClose} isOpen>
      <input
        ref={inputRef}
        maxLength={32}
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <p className="create-room-window__err">{err}</p>
      <div className="create-room-window__buttons">
        <Button
          size="small"
          onClick={onCreateRoomBtn}
          className="create-room-window__create-btn"
        >
          Create
        </Button>
        <Button
          size="small"
          onClick={onClose}
          className="create-room-window__cancel_btn"
        >
          Cancel
        </Button>
      </div>
    </ModalWindow>
  );
};

CreateRoomWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
