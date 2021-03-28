import React from 'react';
import { useSelector } from 'react-redux';

import { Button } from 'components/Button';

import './UserList.scss';

export const UserList = () => {
  const users = useSelector((appStore) => appStore.room.users);

  return (
    <aside className="user-list">
      <Button size="small">Invite friend</Button>
      <div className="user-list__list">
        {users.map((user) => (
          <div className="user-list__entry" key={user}>
            {user}
          </div>
        ))}
      </div>
    </aside>
  );
};
