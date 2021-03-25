import { hot } from 'react-hot-loader/root';
import React from 'react';

import { Layout } from 'layouts/Layout';

import './App.scss';

const App = () => (
  <div className="app">
    <Layout />
  </div>
);

export default hot(App);
