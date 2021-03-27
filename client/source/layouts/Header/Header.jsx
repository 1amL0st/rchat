import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { Button } from 'components/Button';

import { LeaveWindow } from './LeaveWindow';
import './Header.scss';

export const Header = () => {
  const userLogin = useSelector((appStore) => appStore.user.login);
  const chatName = useSelector((appStore) => appStore.room.roomName);

  const [leaving, setLeaving] = useState(false);

  const onLeaveBtnClick = () => {
    setLeaving(!leaving);
  };

  return (
    <div className="header">
      <LeaveWindow isOpen={leaving} onClose={onLeaveBtnClick} />
      <Button onClick={onLeaveBtnClick}>Leave</Button>
      <div>{chatName}</div>
      <div>{userLogin}</div>
    </div>
  );
};

export default Header;
