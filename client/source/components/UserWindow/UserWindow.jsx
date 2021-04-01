import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { Window } from 'components/Window';

import './UserWindow.scss';

export const UserWindow = () => {
  const [inputLogin, setInputLogin] = useState('');
  const [err, setErr] = useState('');

  const login = useSelector((appStore) => appStore.user.login);

  const history = useHistory();

  const onNewLoginApply = () => {
    Api.setNewLogin(inputLogin)
      .then(() => {
        setErr('Login changed!');
      })
      .catch((e) => setErr(e));
  };

  const onClose = () => history.goBack();

  return (
    <Window className="user-window">
      <div className="user-window__header">{login}</div>
      <p className="user-window__error">{err}</p>
      <div>
        <input
          type="text"
          placeholder="Input new login"
          value={inputLogin}
          onChange={(e) => setInputLogin(e.target.value)}
        />
        <Button size="small" onClick={onNewLoginApply} className="user-window__apply-login">
          Apply
        </Button>
      </div>
      <Button className="user-window__close-btn" onClick={onClose} size="small">
        Cancel
      </Button>
    </Window>
  );
};
