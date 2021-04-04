import React from 'react';
import PropTypes from 'prop-types';

import './Logo.scss';

import logo from 'icons/logo.png';

export const Logo = ({ onClick }) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };

  return (
    <div className="logo" onClick={onClickHandler} aria-hidden>
      <img className="logo__img" src={logo} alt="Logo" />
      <span className="logo__text">rchat</span>
    </div>
  );
};

Logo.defaultProps = {
  onClick: null,
};

Logo.propTypes = {
  onClick: PropTypes.func,
};
