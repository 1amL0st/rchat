import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { AppStore } from 'store/store';

import App from './App';

import 'i18n/i18n';

import './index.scss';

ReactDOM.render(
  <Suspense fallback="loading">
    <Provider store={AppStore}>
      <App />
    </Provider>
  </Suspense>,
  document.getElementById('root'),
);
