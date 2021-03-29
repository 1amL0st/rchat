import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';

import { Provider } from 'react-redux';
import { AppStore } from 'store/store';

import { Layout } from 'layouts/Layout';
import { Socket } from 'api/Socket';
import { InitApi } from 'api/Api';

import './App.scss';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    async function connectSocket() {
      await Socket.connect();
      setConnected(true);
      InitApi();
    }
    connectSocket();
  }, []);

  return (
    <div className="app">
      {isConnected ? (
        <Provider store={AppStore}>
          <BrowserRouter>
            <Layout />
          </BrowserRouter>
        </Provider>
      ) : null}
    </div>
  );
};

export default hot(App);
