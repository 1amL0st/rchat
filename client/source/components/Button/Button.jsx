import React from 'react';
import classNames from 'class-names';
import PropTypes from 'prop-types';

import './Button.scss';

export const Button = ({ onClick, children, size }) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };

  let sizeClass = '';
  switch (size) {
    case null:
      break;
    case 'small':
      sizeClass = 'button--small';
      break;
    default:
      console.log('Button component gets unkown size! ', size);
      break;
  }

  return (
    <button
      className={classNames('button', sizeClass)}
      type="button"
      onClick={onClickHandler}
    >
      {children}
    </button>
  );
};

Button.defaultProps = {
  onClick: null,
  size: null,
};

Button.propTypes = {
  size: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
