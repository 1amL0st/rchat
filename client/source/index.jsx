import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { AppStore } from 'store/store';

import App from './App';

import 'i18n/i18n';

import './index.scss';

ReactDOM.render(
  <Provider store={AppStore}>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </Provider>,
  document.getElementById('root'),
);
