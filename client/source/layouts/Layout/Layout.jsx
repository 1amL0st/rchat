import React, { useState } from 'react';
import ReactModal from 'react-modal';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { Header } from 'layouts/Header';
import { MsgInput } from 'layouts/MsgInput';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const [isLogging, setLogging] = useState(true);

  const onLoggingSuccess = (login) => {
    console.warn("User's login = ", login);
    setLogging(false);
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
