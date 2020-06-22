import React, { useContext } from 'react';
// context
import AppContext from '../../Context/App/AppContext';
// components
import Avatar from '../../Profile/Avatar';
import LocaleDisplay from '../../Context/Locale/LocaleDisplay';
// translations
import useTranslations from '../../../translations/useTranslations';
// actions
import { openModal } from '../../../actions/creators';
// constants
import { MODALS } from '../../../constants';
import { COLORS } from '../../../constants/styles';

const Drawer = () => {
  const { t } = useTranslations();
  const { dispatch } = useContext(AppContext);

  return (
    <aside className="drawer-root">
      <Avatar width="6rem" />
      <section>
        <p className="name">Hello, Ashley!</p>
      </section>
      <section className="locale-container">
        <LocaleDisplay />
      </section>
      <section className="button-container">
        <button
          type="button"
          className="button-function"
          onClick={() => dispatch(openModal(MODALS.UPLOAD_CSV))}
          data-testid="button-upload"
        >
          {t('drawer.functions.uploadCSV')}
        </button>
      </section>
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

        .name {
          margin-top: 2rem;
          color: ${COLORS.TEXT_DARK_PRIMARY};
        }

        .locale-container {
          padding: 0 1rem;
          margin-top: 2rem;
          text-align: center;
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
