import React from 'react';
import { useSelector } from 'react-redux';

import { Button } from 'components/Button';

import './UserList.scss';

export const UserList = () => {
  const users = useSelector((appStore) => appStore.room.users);

  const onInviteFrined = () => {
    const dummy = document.createElement('input');

    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);

    alert('Link copied to clipboard!');
  };

  return (
    <aside className="user-list">
      <Button size="small" onClick={onInviteFrined}>Invite friend</Button>
      <div className="user-list__list">
        {users.map((user) => (
          <div className="user-list__entry" title={user} key={user}>
            {user}
          </div>
        ))}
      </div>
    </aside>
  );
};
