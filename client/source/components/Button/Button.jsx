import React from 'react';
import classNames from 'class-names';
import PropTypes from 'prop-types';

import './Button.scss';

export const Button = ({ onClick, children, size, className }) => {
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
  size: null,
};

Button.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};
