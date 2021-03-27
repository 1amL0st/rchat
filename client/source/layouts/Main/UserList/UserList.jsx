import React from 'react';
import { useSelector } from 'react-redux';

import './UserList.scss';

export const UserList = () => {
  const users = useSelector((appStore) => appStore.room.users);

  return (
    <aside className="user-list">
      {users.map((user) => (
        <div key={user}>{user}</div>
      ))}
    </aside>
  );
};
