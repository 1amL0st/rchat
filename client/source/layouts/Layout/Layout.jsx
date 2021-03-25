import React, { useState } from 'react';

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

  return (
    (isLogging) ? (
      <SignUpWindow loggingComplete={onLoggingSuccess} />
    )
      : layout
  );
};
