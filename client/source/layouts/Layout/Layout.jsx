import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import ReactModal from 'react-modal';
import { Route, useHistory } from 'react-router-dom';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { UserWindow } from 'components/UserWindow';
import { LeaveWindow } from 'layouts/Header/LeaveWindow';
import { CreateRoomWindow } from 'components/CreateRoomWindow';
import { InviteUserWindow } from 'components/InviteUserWindow';
import { ROUTES } from 'constants/Routes';

import { InviteToDMWindow } from 'components/InviteToDMWindow';
import { Header } from 'layouts/Header';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const isLogged = useSelector((appStore) => appStore.user.isLogged);

  const invite = useSelector((appStore) => appStore.inviteDM);

  const history = useHistory();

  useEffect(() => {
    if (!isLogged) {
      history.push('/sign_up');
    }
  }, [history, isLogged]);

  return (
    <div className="layout">
      <Route path="/" exact>
        <div className="layout">
          <InviteToDMWindow />
          <Header />
          <Main />
        </div>
      </Route>
      <Route path={ROUTES.SignUp}>
        <SignUpWindow />
      </Route>
      <Route path={ROUTES.UserWindow}>
        <UserWindow />
      </Route>
      <Route path={ROUTES.LeaveWindow}>
        <LeaveWindow />
      </Route>
      <Route path={ROUTES.CreateRoom}>
        <CreateRoomWindow />
      </Route>
      <Route path={ROUTES.InviteUser}>
        <InviteUserWindow />
      </Route>
    </div>
  );
};
