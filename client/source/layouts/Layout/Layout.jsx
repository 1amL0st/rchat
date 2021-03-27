import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { Header } from 'layouts/Header';
import { MsgInput } from 'layouts/MsgInput';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const dispatch = useDispatch();
  const isLogging = useSelector((appStore) => appStore.user.isLogged);

  const onLoggingSuccess = (login) => {
    dispatch({
      type: 'SetUserLogin',
      login,
    });
  };

  const layout = (
    <div className="layout">
      <Header />
      <Main />
      <MsgInput />
    </div>
  );

  return isLogging ? (
    <ReactModal
      className="signin-modal-window"
      isOpen
      contentLabel="Hello world"
      shouldCloseOnOverlayClick
      ariaHideApp={false}
    >
      <SignUpWindow loggingComplete={onLoggingSuccess} />
    </ReactModal>
  ) : (
    layout
  );
};
