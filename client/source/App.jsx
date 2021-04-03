import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';

import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { Layout } from 'layouts/Layout';
import { Api } from 'api/Api';
import { CriticalErrWindow } from 'components/CriticalErrWindow';
import { WaitingForWindow } from 'components/WaitingForWindow';
import { ModalWindow } from 'components/ModalWindow';

import './App.scss';

const App = () => {
  const [isConnected, setConnected] = useState(false);
  const isErr = useSelector((appStore) => appStore.criticalErr.isErr);
  const isWaitingFor = useSelector((appStore) => appStore.waitingFor.isWaiting);

  useEffect(() => {
    async function connectSocket() {
      await Api.connect();
      setConnected(true);
    }
    connectSocket();
  }, []);

  if (isErr) {
    return <CriticalErrWindow />;
  }
  return (
    <div className="app">
      <ModalWindow priority="High" isOpen={isWaitingFor}>
        <WaitingForWindow />
      </ModalWindow>
      {isConnected && (
        <BrowserRouter>
          <Layout />
        </BrowserRouter>
      )}
    </div>
  );
};

export default hot(App);
