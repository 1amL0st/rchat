import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';

import { Layout } from 'layouts/Layout';
import { Socket } from 'api/Socket';

import './App.scss';

const App = () => {
  const [isConnected, setConnected] = useState(false);

  useEffect(() => {
    async function connectSocket() {
      await Socket.connect();
      setConnected(true);
    }
    connectSocket();
  }, []);

  return <div className="app">{isConnected ? <Layout /> : null}</div>;
};

export default hot(App);
