import React, { useState } from 'react';

import { useSelector } from 'react-redux';

import { IconButton } from 'components/IconButton';
import { InviteUserWindow } from 'components/InviteUserWindow';

import { Api } from 'api/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './UserList.scss';

export const UserList = () => {
  const [isInviteWindowOpen, setIsInviteWindowOpen] = useState(false);

  const users = useSelector((appStore) => appStore.room.users);

  const onInviteFrined = () => setIsInviteWindowOpen(!isInviteWindowOpen);
  const onInviteWindowClose = () => setIsInviteWindowOpen(!isInviteWindowOpen);

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
      {isInviteWindowOpen && <InviteUserWindow onClose={onInviteWindowClose} />}
    </aside>
  );
};
