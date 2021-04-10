import React from 'react';

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import { ModalWindow } from 'components/ModalWindow';
import { Button } from 'components/Button';

export const LeaveWindow = ({ onClose }) => {
  const onYesBtn = () => window.location.reload();
  const { t } = useTranslation();

  return (
    <ModalWindow className="leave-window" onClose={onClose} isOpen>
      <div>
        {t('phrases.leaveWindowWarn')}
        {/* Are you sure you want leave?
        <br />
        You'll lose all data! */}
      </div>
      <div className="leave-window__controls">
        <Button size="small" onClick={onYesBtn}>
          {t('words.yes')}
        </Button>
        <Button size="small" onClick={onClose}>
          {t('words.cancel')}
        </Button>
      </div>
    </ModalWindow>
  );
};

LeaveWindow.propTypes = {
  onClose: PropTypes.func.isRequired,
};
