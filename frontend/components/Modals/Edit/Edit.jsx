import React, { useContext, useState, useEffect } from 'react';
// contexts
import AppContext from '../../Context/App/AppContext';
// components
import ModalLayout from '../../Layouts/ModalLayout';
import { Spinner } from '../../General/Animations';
import TextField from '../../General/Inputs/TextField';
// translations
import useTranslations from '../../../translations/useTranslations';
// actions
import { closeModal, submitEdit } from '../../../actions/creators';
// constants
import { COLORS } from '../../../constants/styles';

const Edit = () => {
  const {
    dispatch,
    dispatchAsync,
    state: {
      modal: { value },
      edit: { loading, success, error },
    },
  } = useContext(AppContext);
  const { t } = useTranslations();

  const [name, setName] = useState(value?.name ?? '');
  const [login, setLogin] = useState(value?.login ?? '');
  const [salary, setSalary] = useState(value?.salary ?? 0);

  useEffect(() => {
    if (value) {
      setName(value.name);
      setLogin(value.login);
      setSalary(value.salary);
    }
  }, [value]);

  const handleSubmit = () => {
    dispatchAsync(
      submitEdit({
        id: value.id,
        name,
        login,
        salary,
      }),
    );
  };

  return (
    <ModalLayout title={t('edit.title')}>
      <div className="edit-root" data-testid="edit-root">
        <div>
          {t('dashboard.columns.id')}: {value?.id}
        </div>
        <div className="input-wrapper" data-testid="name">
          <TextField label={t('dashboard.columns.name')} value={name} onChange={setName} />
        </div>
        <div className="input-wrapper" data-testid="login">
          <TextField label={t('dashboard.columns.login')} value={login} onChange={setLogin} />
        </div>
        <div className="input-wrapper" data-testid="salary">
          <TextField
            label={t('dashboard.columns.salary')}
            value={salary}
            onChange={setSalary}
            type="number"
          />
        </div>
        {loading && (
          <div data-testid="spinner">
            <Spinner width="3rem" />
          </div>
        )}
        {!loading && success && (
          <div className="message message--success" data-testid="success">
            {t('edit.success')}
          </div>
        )}
        {!loading && error && (
          <div className="message message--error" data-testid="error">
            {error}
          </div>
        )}
        <footer className="buttons-wrapper">
          <button
            type="button"
            className="button-cancel"
            onClick={() => dispatch(closeModal())}
            disabled={loading}
            data-testid="button-cancel"
          >
            {t(success ? 'prompts.close' : 'prompts.cancel')}
          </button>
          <button
            type="button"
            className="button-confirm"
            disabled={loading}
            onClick={handleSubmit}
            data-testid="button-confirm"
          >
            {t('prompts.save')}
          </button>
        </footer>
        <style jsx>{`
          .edit-root {
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
            background: ${COLORS.BACKGROUND_DARK_PRIMARY};
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

          .input-wrapper {
            margin-top: 0.5rem;
          }
        `}</style>
      </div>
    </ModalLayout>
  );
};

Edit.propTypes = {};

export default Edit;
