import React, { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';
import classNames from 'class-names';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ROUTES } from 'constants/Routes';
import { LeaveWindow } from 'layouts/Header/LeaveWindow';

import { IconButton } from 'components/IconButton';
import { Button } from 'components/Button';
import * as Icons from '@fortawesome/free-solid-svg-icons';

import './UserPanel.scss';

const List = ({ onClose, onLeaveWindowOpen }) => {
  const userLogin = useSelector((appStore) => appStore.user.login);
  const history = useHistory();
  const listRef = useRef();
  const { t } = useTranslation();

  const onProfileClick = () => history.push(ROUTES.UserWindow);

  useEffect(() => {
    const handler = (e) => {
      if (listRef.current && !listRef.current.contains(e.target)) {
        onClose();
      }
    };

    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [onClose, listRef]);

  return (
    <div className={classNames('user-panel__list')} ref={listRef}>
      <span className="user-panel__name">{userLogin}</span>
      <Button onClick={onProfileClick}>{t('phrases.editProfile')}</Button>
      <Button onClick={onLeaveWindowOpen}>{t('words.leave')}</Button>
    </div>
  );
};

List.propTypes = {
  onClose: PropTypes.func.isRequired,
  onLeaveWindowOpen: PropTypes.func.isRequired,
};

export const UserPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLeaveWindowOpen, setIsLeaveWindowOpen] = useState(false);

  const onLeaveWindowClose = () => setIsLeaveWindowOpen(!isLeaveWindowOpen);
  const onLeaveWindowOpen = () => setIsLeaveWindowOpen(true);

  return (
    <div className="user-panel">
      <IconButton
        className="user-panel__btn"
        onClick={() => setIsOpen(!isOpen)}
        icon={Icons.faUserCog}
      />
      {isOpen && (
        <List
          onClose={() => setIsOpen(false)}
          onLeaveWindowOpen={onLeaveWindowOpen}
        />
      )}
      {isLeaveWindowOpen && <LeaveWindow onClose={onLeaveWindowClose} />}
    </div>
  );
};
