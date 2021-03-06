import React, { useState } from 'react';
import classNames from 'class-names';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Api } from 'api/Api';

import { Button } from 'components/Button';
import { Window } from 'components/Window';

import './UserWindow.scss';

export const UserWindow = () => {
  const [inputLogin, setInputLogin] = useState('');

  const [msgText, setMsgText] = useState('');
  const [isErr, setIsErr] = useState(false);
  const { t } = useTranslation();

  const login = useSelector((appStore) => appStore.user.login);

  const history = useHistory();

  const onNewLoginApply = () => {
    Api.userController
      .setNewLogin(inputLogin)
      .then(() => {
        setMsgText('Login changed!');
        setIsErr(false);
      })
      .catch((e) => {
        setMsgText(e);
        setIsErr(true);
      });
  };

  const onClose = () => history.goBack();

  return (
    <Window className="user-window" onShouldClose={onClose}>
      <div className="user-window__header">{login}</div>
      <p
        className={classNames('user-window__msg', {
          'user-window__msg--error': isErr,
        })}
      >
        {msgText}
      </p>
      <div>
        <input
          maxLength={32}
          type="text"
          placeholder={t('phrases.inputNewLogin')}
          value={inputLogin}
          onChange={(e) => setInputLogin(e.target.value)}
        />
        <Button
          size="small"
          onClick={onNewLoginApply}
          className="user-window__apply-login"
        >
          {t('words.apply')}
        </Button>
      </div>
      <Button className="user-window__close-btn" onClick={onClose} size="small">
        {t('words.cancel')}
      </Button>
    </Window>
  );
};
