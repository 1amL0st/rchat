import { hot } from 'react-hot-loader/root';
import React, { useState } from 'react';

import './App.scss';

const Counter = () => {
  const [count, setCount] = useState(0);

  return (
    <div className="counter">
      <button onClick={() => setCount(count - 1)} type="button">-</button>
      <p>
        Sam
        {count}
      </p>
      <button onClick={() => setCount(count + 1)} type="button">+</button>
    </div>
  );
};

const App = () => (
  <div className="app">
    <Counter />
    <h1>Hello React Template!</h1>
    <h2>H2</h2>
    <h3>HHH</h3>
  </div>
);

export default hot(App);
