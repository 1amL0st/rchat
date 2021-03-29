import React, { useState } from 'react';

import ReactModal from 'react-modal';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './UserWindow.scss';

export const UserWindow = () => {
  const login = useSelector((appStore) => appStore.user.login);
  const [inputLogin, setInputLogin] = useState(login);
  const [err, setErr] = useState('');

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
    <ReactModal
      className="user-modal-window"
      isOpen
      shouldCloseOnOverlayClick
      onRequestClose={onClose}
      ariaHideApp={false}
    >
      <ModalWindow className="user-window">
        <p className="user-window__header">User</p>
        <p className="user-window__error">{err}</p>
        <div>
          <input
            type="text"
            placeholder="Input new login"
            value={inputLogin}
            onChange={(e) => setInputLogin(e.target.value)}
          />
          <Button size="small" onClick={onNewLoginApply}>
            Apply
          </Button>
        </div>
        <Button
          className="user-window__close-btn"
          onClick={onClose}
          size="small"
        >
          Cancel
        </Button>
      </ModalWindow>
    </ReactModal>
  );
};
