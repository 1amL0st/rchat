import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

import './ModalWindow.scss';

const makeStyles = (priority) => {
  const priorities = ['Low', 'Middle', 'High'];
  return {
    overlay: {
      backgroundColor: 'rgba(29, 36, 55, 0.8)',
      margin: '0 4px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: (priorities.indexOf(priority) + 1) * 10,
    },
    content: {
      padding: '8px',
    },
  };
};

export const ModalWindow = ({
  isOpen,
  className,
  priority,
  children,
}) => {
  const onRequestClose = () => {
    console.log('Window shoudl be close!');
  };

  return (
    <ReactModal
      className={classNames('modal-window', className)}
      ariaHideApp={false}
      style={makeStyles(priority)}
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
  priority: 'Low',
  className: '',
  onShouldClose: null,
};

ModalWindow.propTypes = {
  priority: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onShouldClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
