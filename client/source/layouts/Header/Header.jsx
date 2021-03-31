import React from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ROUTES } from 'constants/Routes';

import { IconButton } from 'components/IconButton';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import { Logo } from 'components/Logo';

import './Header.scss';

export const Header = () => {
  const chatName = useSelector((appStore) => appStore.room.roomName);

  const history = useHistory();

  return (
    <header className="header">
      <aside>
        <Logo onClick={() => history.push(ROUTES.LeaveWindow)} />
      </aside>

      <div>{chatName}</div>

      <aside>
        <IconButton
          className="header__login"
          onClick={() => history.push(ROUTES.UserWindow)}
          icon={Icons.faUserCog}
        />
      </aside>
    </header>
  );
};

export default Header;
