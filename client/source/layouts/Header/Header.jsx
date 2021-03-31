import React from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ROUTES } from 'constants/Routes';

import { IconButton } from 'components/IconButton';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { Logo } from 'components/Logo';

import './Header.scss';

export const Header = () => {
  const roomName = useSelector((appStore) => appStore.room.roomName);
  const userLogin = useSelector((appStore) => appStore.user.login);

  const history = useHistory();

  return (
    <header className="header">
      <aside>
        <Logo onClick={() => history.push(ROUTES.LeaveWindow)} />
      </aside>

      <div>{roomName}</div>

      <aside>
        <div className="header__login">
          <span className="header__login__name">{userLogin}</span>
          <IconButton
            className="header__login__btn"
            onClick={() => history.push(ROUTES.UserWindow)}
            icon={Icons.faUserCog}
          />
        </div>
      </aside>
    </header>
  );
};

export default Header;
