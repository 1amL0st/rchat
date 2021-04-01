import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Layout } from 'layouts/Layout';
import { Api } from 'api/Api';
import { CriticalErrWindow } from 'components/CriticalErrWindow';

import './App.scss';

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const isErr = useSelector((appStore) => appStore.criticalErr.isErr);

  useEffect(() => {
    async function connectSocket() {
      await Api.connect();
      setConnected(true);
    }
    connectSocket();
  }, []);

  let content;
  if (isErr) {
    content = <CriticalErrWindow />;
  } else {
    content = isConnected && (
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
  }

  return <div className="app">{content}</div>;
};

export default hot(App);
