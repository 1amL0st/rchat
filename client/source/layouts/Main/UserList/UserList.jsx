import React from 'react';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IconButton } from 'components/IconButton';
import { ROUTES } from 'constants/Routes';
import { Api } from 'api/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './UserList.scss';

export const UserList = () => {
  const users = useSelector((appStore) => appStore.room.users);
  const history = useHistory();

  const onInviteFrined = () => {
    history.push(ROUTES.InviteUser);
  };

  const userList = users.map((user) => (
    <div
      className="user-list__entry"
      title={user}
      key={user}
      aria-hidden
      onClick={() => Api.inviteToDM(user)}
    >
      <div className="user-list__entry__name">{user}</div>
    </div>
  ));

  return (
    <aside className="user-list">
      <div className="user-list__header">
        <span>Users</span>
        <IconButton icon={Icons.faPlus} onClick={onInviteFrined} />
      </div>
      <div className="user-list__list">{userList}</div>
    </aside>
  );
};
