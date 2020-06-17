import React, { useContext } from 'react';
// context
import AppContext, { APP_ACTIONS } from '../../Context/App/AppContext';
// components
import Avatar from '../../Profile/Avatar';
// translations
import useTranslations from '../../../translations/useTranslations';
// constants
import { MODALS } from '../../../constants';
import { COLORS } from '../../../constants/styles';

const Drawer = () => {
  const { t } = useTranslations();
  const { dispatch } = useContext(AppContext);

  return (
    <aside className="drawer-root">
      <Avatar width="6rem" />
      <div className="button-container">
        <button
          type="button"
          className="button-function"
          onClick={() =>
            dispatch({
              type: APP_ACTIONS.MODAL_CLOSE,
              payload: MODALS.UPLOAD_CSV,
            })
          }
        >
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
