import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import './Window.scss';

export const Window = ({ className, children, onShouldClose }) => {
  const windowRef = useRef();

  const onKeyDown = (e) => {
    console.log('KEYDOWN');
    if (e.code === 'Escape') {
      if (onShouldClose) onShouldClose();
    }
  };

  useEffect(() => {
    windowRef.current.focus();
  });

  return (
    <div
      className={classNames(className, 'window')}
      onKeyDown={onKeyDown}
      tabIndex="0"
      ref={windowRef}
    >
      <div className="window__content">{children}</div>
    </div>
  );
};

Window.defaultProps = {
  className: '',
  onShouldClose: null,
};

Window.propTypes = {
  className: PropTypes.string,
  onShouldClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
