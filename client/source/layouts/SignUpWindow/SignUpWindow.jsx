import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './SignUpWindow.scss';

export const SignUpWindow = () => {
  const [login, setLogin] = useState('');
  const [err, setErr] = useState('');

  const dispatch = useDispatch();
  const onLoginBtn = async () => {
    console.log('onLoginBtn = ', Api);
    Api.logging(login)
      .then((l) => {
        dispatch({
          type: 'SetUserLogin',
          login: l,
        });
      })
      .catch((e) => setErr(e));
  };

  const onLoginInputKeyDown = (e) => {
    if (!e.shiftKey && e.code === 'Enter') {
      onLoginBtn();
      e.preventDefault();
    }
  };

  const loginInputRef = (input) => input?.focus();

  const onLoginInputChange = (e) => {
    setLogin(e.target.value);
  };

  return (
    <ModalWindow className="signup-window" isOpen>
      <div className="signup-window__warning">
        Warning
        <br />
        This service is under development, some bugs are possible!
      </div>
      <p className="signup-window__error">{err}</p>
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
