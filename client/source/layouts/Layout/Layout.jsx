import React, { useEffect } from 'react';

import { Route, useHistory } from 'react-router-dom';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { UserWindow } from 'components/UserWindow';
import { LeaveWindow } from 'layouts/Header/LeaveWindow';

import { Header } from 'layouts/Header';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const history = useHistory();

  useEffect(() => {
    history.push('/sign_up');
  }, [history]);

  const layout = (
    <div className="layout">
      <Header />
      <Main />
    </div>
  );

  return (
    <div className="layout">
      <Route path="/" exact>
        {layout}
      </Route>
      <Route path="/sign_up">
        <SignUpWindow />
      </Route>
      <Route path="/user_window">
        <UserWindow />
      </Route>
      <Route path="/leave_window">
        <LeaveWindow />
      </Route>
    </div>
  );
};
