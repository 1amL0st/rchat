import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { Window } from 'components/Window';

import './SignUpWindow.scss';

export const SignUpWindow = () => {
  const history = useHistory();

  const [login, setLogin] = useState('');
  const loginInputRef = useRef();
  const [err, setErr] = useState('');

  const dispatch = useDispatch();
  const onLoginBtn = async () => {
    Api.logging(login)
      .then((l) => {
        dispatch({
          type: 'SetUserLogin',
          login: l,
        });
        history.push('/');
      })
      .catch((e) => setErr(e));
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

  return (
    <Window className="sign-up-window">
      <input
        ref={loginInputRef}
        value={login}
        type="text"
        placeholder="Enter login"
        onKeyDown={onLoginInputKeyDown}
        onChange={onLoginInputChange}
      />
      <p className="signup-window__error">{err}</p>
      <div className="signup-window__controls">
        <Button size="small" onClick={onLoginBtn}>
          Login
        </Button>
      </div>
    </Window>
  );
};
