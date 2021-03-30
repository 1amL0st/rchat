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
        console.log('Room created!');
        history.goBack();
      })
      .catch((e) => setErr(e));
  };

  return (
    <Window className="create-room-window">
      <input
        type="text"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <div className="create-room-window__err">{err}</div>
      <div className="create-room-window__buttons">
        <Button size="small" onClick={onCreateRoomBtn}>
          Create
        </Button>
        <Button size="small" onClick={() => history.goBack()}>
          Cancel
        </Button>
      </div>
    </Window>
  );
};