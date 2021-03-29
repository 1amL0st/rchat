import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { Switch,
  Route,
  Link,
  BrowserRouter,
  useHistory } from 'react-router-dom';

import { SignUpWindow } from 'layouts/SignUpWindow';
import { Header } from 'layouts/Header';
import { Main } from 'layouts/Main';

import './Layout.scss';

export const Layout = () => {
  const dispatch = useDispatch();
  const isLogging = useSelector((appStore) => appStore.user.isLogged);
  const history = useHistory();

  const onLoggingSuccess = (login) => {
    dispatch({
      type: 'SetUserLogin',
      login,
    });
  };

  useEffect(() => {
    history.push('/sign_up');
  }, []);

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
        <SignUpWindow loggingComplete={onLoggingSuccess} />
      </Route>
    </div>
  );
};
