import React from 'react';

import { useSelector } from 'react-redux';
import { Route } from 'react-router-dom';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { UserWindow } from 'components/UserWindow';
import { ROUTES } from 'constants/Routes';

import { InviteToDMWindow } from 'components/InviteToDMWindow';
import { Header } from 'layouts/Header';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const isLogged = useSelector((appStore) => appStore.user.isLogged);

  return (
    <div className="layout">
      <Route path="/" exact>
        <div className="layout">
          <InviteToDMWindow />
          <Header />
          <Main />
        </div>
      </Route>
      {!isLogged && <SignUpWindow />}
      <Route path={ROUTES.UserWindow}>
        <UserWindow />
      </Route>
    </div>
  );
};
