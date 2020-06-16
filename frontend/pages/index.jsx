import React from 'react';
// translations
import useTranslations from '../translations/useTranslations';

const Index = () => {
  const { t } = useTranslations();

  return (
    <div className="root">
      <h1>{t('index.title')}</h1>
      <style jsx>
        {`
          .root {
          }
        `}
      </style>
    </div>
  );
};

export default Index;
