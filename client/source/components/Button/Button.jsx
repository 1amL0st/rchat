import React from 'react';
import classNames from 'class-names';
import PropTypes from 'prop-types';

import './Button.scss';

export const Button = ({ onClick, children, size, className }) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };

  const sizeClass = {
    small: 'button--small',
  }[size];

  if (sizeClass === 'undefined') {
    console.log('Button component gets unkown size! ', size);
  }

  return (
    <button
      title={children}
      className={classNames('button', sizeClass, className)}
      type="button"
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  className: '',
  onClick: null,
  size: 'small',
};

Button.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
