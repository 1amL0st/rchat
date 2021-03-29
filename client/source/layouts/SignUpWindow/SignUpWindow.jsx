import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './SignUpWindow.scss';

export const SignUpWindow = ({ loggingComplete }) => {
  const history = useHistory();

  const [login, setLogin] = useState('');
  const loginInputRef = useRef();
  const [err, setErr] = useState('');

  const onLoginBtn = async () => {
    Api.logging(login)
      .then((l) => {
        loggingComplete(l);
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
    <ReactModal
      isOpen
      className="signin-modal-window"
      onAfterOpen={() => loginInputRef.current.focus()}
      contentLabel="Hello world"
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <ModalWindow>
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
      </ModalWindow>
    </ReactModal>
  );
};

SignUpWindow.propTypes = {
  loggingComplete: PropTypes.func.isRequired,
};
