import React, { useContext } from 'react';
// contexts
import AppContext, { APP_ACTIONS } from '../../Context/App/AppContext';
// components
import ModalLayout from '../../Layouts/ModalLayout';
import { Spinner } from '../../General/Animations';
// translations
import useTranslations from '../../../translations/useTranslations';

const Upload = () => {
  const {
    dispatchAsync,
    state: {
      upload: { loading, success, error },
    },
  } = useContext(AppContext);
  const { t } = useTranslations();

  const handleChange = (ev) => {
    const { files } = ev.target;
    if (files.length) {
      dispatchAsync({ type: APP_ACTIONS.UPLOAD_CSV.SUBMIT, payload: files[0] });
    }
  };

  return (
    <ModalLayout title={t('upload.title')}>
      <div className="upload-root">
        {!loading && <input type="file" id="input-file" accept=".csv" onChange={handleChange} />}
        {loading && (
          <div>
            <Spinner width="3rem" />
          </div>
        )}
        {!loading && success && (
          <div className="message message--success">{t('upload.success')}</div>
        )}
        {!loading && error && <div className="message message--error">{error}</div>}
        <style jsx>{`
          .upload-root {
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
        `}</style>
      </div>
    </ModalLayout>
  );
};

Upload.propTypes = {};

export default Upload;
