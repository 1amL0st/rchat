import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { AppStore } from 'store/store';

import App from './App';

import './index.scss';

ReactDOM.render(
  <Provider store={AppStore}>
    <App />
  </Provider>,
  document.getElementById('root')
);
