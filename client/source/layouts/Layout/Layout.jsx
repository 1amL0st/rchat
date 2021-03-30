import React, { useEffect } from 'react';

import { Route, useHistory } from 'react-router-dom';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { UserWindow } from 'components/UserWindow';
import { LeaveWindow } from 'layouts/Header/LeaveWindow';
import { CreateRoomWindow } from 'components/CreateRoomWindow';
import { ROUTES } from 'constants/Routes';

import { Header } from 'layouts/Header';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const history = useHistory();

  useEffect(() => {
    history.push('/sign_up');
  }, [history]);

  return (
    <div className="layout">
      <Route path="/" exact>
        <div className="layout">
          <Header />
          <Main />
        </div>
      </Route>
      <Route path={ROUTES.SignUp} component={SignUpWindow} />
      <Route path={ROUTES.UserWindow} component={UserWindow} />
      <Route path={ROUTES.LeaveWindow} component={LeaveWindow} />
      <Route path={ROUTES.CreateRoom} component={CreateRoomWindow} />
    </div>
  );
};
