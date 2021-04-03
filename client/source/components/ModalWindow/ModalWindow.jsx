import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import './ModalWindow.scss';

const customStyles = {
  overlay: {
    backgroundColor: 'rgba(29, 36, 55, 0.8)',
    margin: '0 4px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
  },
};

export const ModalWindow = ({
  isOpen,
  className,
  children,
}) => {
  const onRequestClose = () => {
    console.log('Window shoudl be close!');
  };

  return (
    <ReactModal
      className={classNames('modal-window', className)}
      ariaHideApp={false}
      style={customStyles}
      isOpen={isOpen}
      shouldCloseOnOverlayClick
      onAfterOpen={() => {}}
      onRequestClose={onRequestClose}
    >
      {children}
    </ReactModal>
  );
};

ModalWindow.defaultProps = {
  className: '',
  onShouldClose: null,
};

ModalWindow.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onShouldClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
