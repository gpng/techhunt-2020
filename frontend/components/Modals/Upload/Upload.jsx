import React, { useContext } from 'react';
// contexts
import AppContext from '../../Context/App/AppContext';
// components
import ModalLayout from '../../Layouts/ModalLayout';
import { Spinner } from '../../General/Animations';
// translations
import useTranslations from '../../../translations/useTranslations';
// actions
import { submitUploadCSV } from '../../../actions/creators';

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
      dispatchAsync(submitUploadCSV(files[0]));
    }
  };

  return (
    <ModalLayout title={t('upload.title')}>
      <div className="upload-root" data-testid="upload-root">
        {!loading && (
          <input type="file" accept=".csv" onChange={handleChange} data-testid="input-file" />
        )}
        {loading && (
          <div data-testid="spinner">
            <Spinner width="3rem" />
          </div>
        )}
        {!loading && success && (
          <div className="message message--success" data-testid="success">
            {t('upload.success')}
          </div>
        )}
        {!loading && error && (
          <div className="message message--error" data-testid="error">
            {error}
          </div>
        )}
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
