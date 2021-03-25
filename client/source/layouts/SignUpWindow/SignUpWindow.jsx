import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { Socket } from 'api/Socket';

import { Button } from 'components/Button';

import './SignUpWindow.scss';

export const SignUpWindow = ({
  loggingComplete,
}) => {
  const [login, setLogin] = useState('');

  const onSocketMsg = (e) => {
    const json = JSON.parse(e.data);
    if (json.subType === 'LoggingSuccess') {
      loggingComplete(login);
    }
  };

  const onSignInBtn = () => {
    const req = `/login ${login}`;
    console.log('req = ', req);
    Socket.socket.send(req);
  };

  useEffect(() => {
    Socket.socket.addEventListener('message', onSocketMsg);
    return () => {
      Socket.socket.removeEventListener('message', onSocketMsg);
    };
  }, []);

  return (
    <ReactModal
      className="leave-modal-window"
      isOpen
      contentLabel="Hello world"
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <input type="text" placeholder="Enter login" onChange={(e) => setLogin(e.target.value)} />
      <div className="leave-modal-window__controls">
        <Button size="small" onClick={onSignInBtn}>
          Login
        </Button>
      </div>
    </ReactModal>
  );
};

SignUpWindow.propTypes = {
  loggingComplete: PropTypes.func.isRequired,
};