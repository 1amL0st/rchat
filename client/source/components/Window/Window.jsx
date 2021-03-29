import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import './Window.scss';

export const Window = ({ className, children }) => (
  <div className={classNames(className, 'window')}>
    <div className="window__content">{children}</div>
  </div>
);

Window.defaultProps = {
  className: '',
};

Window.propTypes = {
  className: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
