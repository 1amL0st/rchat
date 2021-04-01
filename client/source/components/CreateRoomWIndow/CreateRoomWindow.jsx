import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { Api } from 'api/Api';
import { Button } from 'components/Button';
import { Window } from 'components/Window';

import './CreateRoomWindow.scss';

export const CreateRoomWindow = () => {
  const history = useHistory();
  const [roomName, setRoomName] = useState('');
  const [err, setErr] = useState('');

  const onCreateRoomBtn = () => {
    Api.createRoom(roomName)
      .then(() => {
        history.goBack();
      })
      .catch((e) => setErr(e));
  };

  return (
    <Window className="create-room-window">
      <input
        maxLength={32}
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
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
          onClick={() => history.goBack()}
          className="create-room-window__cancel_btn"
        >
          Cancel
        </Button>
      </div>
    </Window>
  );
};
