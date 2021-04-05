// TODO: Find IconDefinition type for icon prop
/* eslint react/prop-types: 0 */
/* eslint react/forbid-prop-types: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'class-names';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './IconButton.scss';

export const IconButton = ({ className, onClick, icon }) => {
  const onClickHandler = () => {
    if (onClick) onClick();
  };

  return (
    <button
      type="button"
      className={classNames('icon-button', className)}
      onClick={onClickHandler}
    >
      <FontAwesomeIcon icon={icon} />
    </button>
  );
};

IconButton.defaultProps = {
  className: '',
  onClick: null,
};

IconButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.any.isRequired,
};
