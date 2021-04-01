import React from 'react';

import { useSelector } from 'react-redux';

import { Logo } from 'components/Logo';
import { UserPanel } from 'components/UserPanel';

import './Header.scss';

export const Header = () => {
  const roomName = useSelector((appStore) => appStore.room.roomName);

  return (
    <header className="header">
      <aside>
        <Logo onClick={() => {}} />
      </aside>

      <div>{roomName}</div>

      <aside>
        <UserPanel />
      </aside>
    </header>
  );
};

export default Header;
