import React from 'react';
// components
// translations
import useTranslations from '../../translations/useTranslations';
import { COLORS } from '../../constants/styles';
import Avatar from '../Profile/Avatar';

const Drawer = () => {
  const { t } = useTranslations();

  return (
    <aside className="drawer-root">
      <Avatar width="6rem" />
      <div className="button-container">
        <button type="button" className="button-function">
          {t('drawer.functions.uploadCSV')}
        </button>
      </div>
      <style jsx>{`
        .drawer-root {
          background: ${COLORS.BACKGROUND_DARK_PRIMARY};
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem 0;
        }

        .button-container {
          margin-top: 2rem;
          width: 100%;
        }

        .button-function {
          width: 100%;
          background: ${COLORS.BACKGROUND_DARK_SECONDARY};
          color: ${COLORS.TEXT_DARK_PRIMARY};
          border: none;
          padding: 0.5rem 0;
        }
      `}</style>
    </aside>
  );
};

export default Drawer;
