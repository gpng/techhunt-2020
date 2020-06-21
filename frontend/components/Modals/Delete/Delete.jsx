import React, { useContext } from 'react';
// contexts
import AppContext from '../../Context/App/AppContext';
// components
import ModalLayout from '../../Layouts/ModalLayout';
import { Spinner } from '../../General/Animations';
// translations
import useTranslations from '../../../translations/useTranslations';
// actions
import { closeModal, submitDelete } from '../../../actions/creators';

const Delete = () => {
  const {
    dispatch,
    dispatchAsync,
    state: {
      modal: { value },
      delete: { loading, success, error },
    },
  } = useContext(AppContext);
  const { t } = useTranslations();

  return (
    <ModalLayout title={t('delete.title')}>
      <div className="delete-root" data-testid="delete-root">
        <p>{`${t('delete.employeeId')}${value}`}</p>
        {!loading && (
          <div data-testid="message">
            <p>{t('delete.message')}</p>
          </div>
        )}
        {loading && (
          <div data-testid="spinner">
            <Spinner width="3rem" />
          </div>
        )}
        {!loading && success && (
          <div className="message message--success" data-testid="success">
            {t('delete.success')}
          </div>
        )}
        {!loading && error && (
          <div className="message message--error" data-testid="error">
            {error}
          </div>
        )}
        <div className="buttons-wrapper">
          <button
            type="button"
            className="button-cancel"
            onClick={() => dispatch(closeModal())}
            disabled={loading}
            data-testid="button-cancel"
          >
            {t(success ? 'prompts.close' : 'prompts.cancel')}
          </button>
          {!success && (
            <button
              type="button"
              className="button-confirm"
              onClick={() => dispatchAsync(submitDelete(value))}
              disabled={loading}
              data-testid="button-confirm"
            >
              {t('prompts.confirm')}
            </button>
          )}
        </div>
        <style jsx>{`
          .delete-root {
          }

          .message {
            margin-top: 0.5rem;
          }

          .message--success {
            color: green;
          }

          .message--error {
            color: red;
          }

          .button-cancel {
            border: none;
          }

          .button-confirm {
            background: red;
            border: none;
            padding: 0.4rem 0.8rem;
            border-radius: 0.4rem;
            color: #ffffff;
          }

          .buttons-wrapper {
            margin-top: 1rem;
            display: flex;
            justify-content: space-between;
          }
        `}</style>
      </div>
    </ModalLayout>
  );
};

Delete.propTypes = {};

export default Delete;
