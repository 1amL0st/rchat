import React, { useState, useEffect, useRef } from 'react';

import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { IconButton } from 'components/IconButton';
import { InviteUserWindow } from 'components/InviteUserWindow';

import { Api } from 'api/Api';

import * as Icons from '@fortawesome/free-solid-svg-icons';

import './UserList.scss';

export const UserList = ({ rightOffset }) => {
  const [isInviteWindowOpen, setIsInviteWindowOpen] = useState(false);
  const userListRef = useRef();

  const users = useSelector((appStore) => appStore.room.users);
  const userLogin = useSelector((appStore) => appStore.user.login);

  const onInviteFrined = () => setIsInviteWindowOpen(!isInviteWindowOpen);
  const onInviteWindowClose = () => setIsInviteWindowOpen(!isInviteWindowOpen);

  useEffect(() => {
    const stopEventPropagation = (e) => e.stopPropagation();

    userListRef.current?.addEventListener('touchmove', stopEventPropagation);
    userListRef.current?.addEventListener('mousemove', stopEventPropagation);

    const copy = userListRef.current;

    return () => {
      copy.removeEventListener('touchmove', stopEventPropagation);
      copy.removeEventListener('mousemove', stopEventPropagation);
    };
  }, [userListRef]);

  const userList = users
    .filter((user) => user !== userLogin)
    .map((user) => (
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
    <aside
      className="user-list"
      style={{
        right: `${rightOffset}%`,
      }}
      ref={userListRef}
    >
      <div className="user-list__header">
        <span>Users</span>
        <IconButton icon={Icons.faPlus} onClick={onInviteFrined} />
      </div>
      <div className="user-list__list">{userList}</div>
      {isInviteWindowOpen && <InviteUserWindow onClose={onInviteWindowClose} />}
    </aside>
  );
};

UserList.propTypes = {
  rightOffset: PropTypes.number.isRequired,
};
