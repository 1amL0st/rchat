import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { Api } from 'api/Api';
import { Button } from 'components/Button';
import { ModalWindow } from 'components/ModalWindow';

import './SignUpWindow.scss';

export const SignUpWindow = () => {
  const [login, setLogin] = useState('');
  const [err, setErr] = useState('');

  const { t } = useTranslation();

  const onLoginBtn = async () => {
    Api.userController.logging(login).catch((e) => setErr(e));
  };

  const onLoginInputKeyDown = (e) => {
    if (!e.shiftKey && e.code === 'Enter') {
      onLoginBtn();
      e.preventDefault();
    }
  };

  const loginInputRef = (input) => input?.focus();

  const onLoginInputChange = (e) => {
    setLogin(e.target.value);
  };

  const onLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <ModalWindow className="signup-window" isOpen>
      <div className="signup-window__warning">
        {t('words.warning')}
        <br />
        {t('developmentWarning')}
      </div>
      <p className="signup-window__error">{err}</p>
      <input
        ref={loginInputRef}
        value={login}
        type="text"
        placeholder={t('phrases.enterLogin')}
        onKeyDown={onLoginInputKeyDown}
        onChange={onLoginInputChange}
      />
      <div className="signup-window__controls">
        <Button size="small" onClick={onLoginBtn}>
          {t('words.login')}
        </Button>
      </div>
      <select className="signup-window__lang-selector" onChange={onLangChange}>
        <option value="en">En</option>
        <option value="ru">Ru</option>
      </select>
    </ModalWindow>
  );
};
