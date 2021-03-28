import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { UserWindow } from 'components/UserWindow';
import { Button } from 'components/Button';

import { LeaveWindow } from './LeaveWindow';
import './Header.scss';

export const Header = () => {
  const userLogin = useSelector((appStore) => appStore.user.login);
  const chatName = useSelector((appStore) => appStore.room.roomName);

  const [leaving, setLeaving] = useState(false);
  const [userWindow, setUserWindow] = useState(false);

  const onLeaveBtnClick = () => {
    setLeaving(!leaving);
  };

  const onCloseUserWindow = () => {
    console.log('OnCloseUserWindow!');
    setUserWindow(false);
  };

  let window = null;
  if (leaving) {
    window = <LeaveWindow isOpen={leaving} onClose={onLeaveBtnClick} />;
  } else if (userWindow) {
    window = <UserWindow isOpen={userWindow} onClose={onCloseUserWindow} />;
  }

  return (
    <header className="header">
      {window}

      <aside>
        <Button size="small" onClick={onLeaveBtnClick}>
          Leave
        </Button>
      </aside>

      <div>{chatName}</div>

      <aside>
        <Button
          className="header__login"
          onClick={() => setUserWindow(true)}
          size="small"
        >
          {userLogin}
        </Button>
      </aside>
    </header>
  );
};

export default Header;
