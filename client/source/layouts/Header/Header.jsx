import React from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ROUTES } from 'constants/Routes';
import { Button } from 'components/Button';

import './Header.scss';

export const Header = () => {
  const userLogin = useSelector((appStore) => appStore.user.login);
  const chatName = useSelector((appStore) => appStore.room.roomName);

  const history = useHistory();

  return (
    <header className="header">
      <aside>
        <Button size="small" onClick={() => history.push(ROUTES.LeaveWindow)}>
          Leave
        </Button>
      </aside>

      <div>{chatName}</div>

      <aside>
        <Button
          className="header__login"
          onClick={() => history.push(ROUTES.UserWindow)}
          size="small"
        >
          {userLogin}
        </Button>
      </aside>
    </header>
  );
};

export default Header;
