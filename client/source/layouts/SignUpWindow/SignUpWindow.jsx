import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';

import { Socket } from 'api/Socket';

import { Button } from 'components/Button';

import './SignUpWindow.scss';

export const SignUpWindow = ({ loggingComplete }) => {
  const [login, setLogin] = useState();
  const loginInputRef = useRef();

  const onSocketMsg = (e) => {
    const json = JSON.parse(e.data);
    console.log('json = ', json);
    if (json.subType === 'LoggingSuccess') {
      loggingComplete(login);
    }
  };

  const onSignInBtn = () => {
    const req = `/login ${login}`;
    Socket.socket.send(req);
  };

  const onLoginInputChange = (e) => {
    setLogin(e.target.value);
  };

  useEffect(() => {
    Socket.socket.addEventListener('message', onSocketMsg);
    loginInputRef.current.focus();

    return () => {
      Socket.socket.removeEventListener('message', onSocketMsg);
    };
  }, []);

  return (
    <div className="leave-modal-window">
      <input
        ref={loginInputRef}
        type="text"
        placeholder="Enter login"
        onChange={onLoginInputChange}
      />
      <div className="leave-modal-window__controls">
        <Button size="small" onClick={onSignInBtn}>
          Login
        </Button>
      </div>
    </div>
  );
};

SignUpWindow.propTypes = {
  loggingComplete: PropTypes.func.isRequired,
};
