import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Socket } from 'api/Socket';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './SignUpWindow.scss';

export const SignUpWindow = ({ loggingComplete }) => {
  const [login, setLogin] = useState('');
  const loginInputRef = useRef();

  const onLoginBtn = () => {
    const req = `/login ${login}`;
    Socket.socket.send(req);
  };

  const onLoginInputKeyDown = (e) => {
    if (!e.shiftKey && e.code === 'Enter') {
      onLoginBtn();
      e.preventDefault();
    }
  };

  const onLoginInputChange = (e) => {
    setLogin(e.target.value);
  };

  useEffect(() => {
    const onSocketMsg = (e) => {
      const json = JSON.parse(e.data);
      if (json.subType === 'LoggingSuccess') {
        loggingComplete(json.login);
      }
    };

    console.log('This is use effect!');
    Socket.socket.addEventListener('message', onSocketMsg);
    loginInputRef.current.focus();

    return () => {
      Socket.socket.removeEventListener('message', onSocketMsg);
    };
  }, [loggingComplete]);

  return (
    <ModalWindow>
      <input
        ref={loginInputRef}
        value={login}
        type="text"
        placeholder="Enter login"
        onKeyDown={onLoginInputKeyDown}
        onChange={onLoginInputChange}
      />
      <div className="signup-window__controls">
        <Button size="small" onClick={onLoginBtn}>
          Login
        </Button>
      </div>
    </ModalWindow>
  );
};

SignUpWindow.propTypes = {
  loggingComplete: PropTypes.func.isRequired,
};
