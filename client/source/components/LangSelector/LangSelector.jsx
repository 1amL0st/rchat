import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';
import i18n from 'i18next';

import { LANGUAGE_LIST } from 'i18n/i18n';
import './LangSelector.scss';

export const LangSelector = ({ className }) => {
  const onLangChange = (e) => {
    i18n.changeLanguage(e.target.value);
    localStorage.setItem('i18nextLng', e.target.value);
  };

  const options = Array.from(LANGUAGE_LIST.keys()).map((lang) => (
    <option key={lang} value={lang}>
      {LANGUAGE_LIST.get(lang)}
    </option>
  ));

  return (
    <select
      value={i18n.language}
      className={classNames('lang-selector', className)}
      onChange={onLangChange}
    >
      {options}
    </select>
  );
};

LangSelector.defaultProps = {
  className: '',
};

LangSelector.propTypes = {
  className: PropTypes.string,
};
