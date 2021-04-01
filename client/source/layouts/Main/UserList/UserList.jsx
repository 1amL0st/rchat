import React from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/IconButton';
import { ROUTES } from 'constants/Routes';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './UserList.scss';

export const UserList = () => {
  const users = useSelector((appStore) => appStore.room.users);
  const history = useHistory();

  const onInviteFrined = () => {
    history.push(ROUTES.InviteUser);
  };

  return (
    <aside className="user-list">
      <div className="user-list__header">
        <span>Users</span>
        <IconButton icon={Icons.faPlus} onClick={onInviteFrined} />
      </div>
      <div className="user-list__list">
        {users.map((user) => (
          <div className="user-list__entry" title={user} key={user}>
            <div className="user-list__entry__name">{user}</div>
          </div>
        ))}
      </div>
    </aside>
  );
};
