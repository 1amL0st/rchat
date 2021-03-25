import React from 'react';

import { Button } from 'components/Button';

import './Header.scss';

export const Header = () => {
  const onLeaveBtnClick = () => {
    window.location.reload();
  };

  return (
    <div className="header">
      <Button onClick={onLeaveBtnClick}>Leave</Button>
      <div>Login</div>
    </div>
  );
};

export default Header;
