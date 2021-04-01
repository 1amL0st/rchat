import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { Window } from 'components/Window';

import './SignUpWindow.scss';

export const SignUpWindow = () => {
  const history = useHistory();
  const isLogged = useSelector((appStore) => appStore.user.isLogged);

  const [login, setLogin] = useState('');
  const loginInputRef = useRef();
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

  useEffect(() => {
    if (isLogged) {
      history.replace('/');
    }
    loginInputRef.current.focus();
  }, []);

  const onLoginInputChange = (e) => {
    setLogin(e.target.value);
  };

  return (
    <Window className="signup-window">
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
    </Window>
  );
};
