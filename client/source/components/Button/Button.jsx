import React from 'react';
import PropTypes from 'prop-types';

import './Button.scss';

export const Button = ({ onClick, children }) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };

  return (
    <button className="button" type="button" onClick={onClickHandler}>
      {children}
    </button>
  );
};

Button.defaultProps = {
  onClick: null,
};

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
