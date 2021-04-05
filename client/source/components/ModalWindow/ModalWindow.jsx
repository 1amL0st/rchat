import React from 'react';

import classNames from 'class-names';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

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
      padding: '16px',
      borderRadius: '8px',
      backgroundColor: '#1d2b47',
      '&:focus': {
        border: '1px solid red',
      },
    },
    'content:focus': {
      border: '1px solid red',
    },
  };
};

export const ModalWindow = ({
  isOpen,
  className,
  priority,
  children,
  onClose,
}) => {
  const onRequestClose = () => {
    if (onClose) onClose();
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
  onClose: null,
};

ModalWindow.propTypes = {
  priority: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  className: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};
