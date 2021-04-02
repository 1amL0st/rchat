import React from 'react';

import { useSelector } from 'react-redux';

import { Api } from 'api/Api';
import { MAIN_ROOM_NAME } from 'constants/Api';

import { Logo } from 'components/Logo';
import { UserPanel } from 'components/UserPanel';

import './Header.scss';

export const Header = () => {
  const roomName = useSelector((appStore) => appStore.room.roomName);

  const onLogoClick = () => {
    try {
      Api.joinRoom(MAIN_ROOM_NAME);
    } catch (e) {
      console.log('E = ', e);
    }
  };

  return (
    <header className="header">
      <aside>
        <Logo onClick={onLogoClick} />
      </aside>

      <div>{roomName}</div>

      <aside>
        <UserPanel />
      </aside>
    </header>
  );
};

export default Header;
