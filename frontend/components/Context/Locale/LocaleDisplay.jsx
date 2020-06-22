import React from 'react';
// translations
import useTranslations from '../../../translations/useTranslations';
// constants
import LOCALE_NAMES from '../../../constants/locales';
import { COLORS } from '../../../constants/styles';

const getLocaleName = (code) => LOCALE_NAMES[code?.toLowerCase()] ?? code;

const LocaleDisplay = () => {
  const {
    t,
    locale,
    browserLocale: { code: browserLocaleCode, valid },
  } = useTranslations();

  return (
    <div className="locale-display-root">
      <span>{`${t('locale.language')}: ${getLocaleName(locale)}${
        browserLocaleCode && locale !== browserLocaleCode && !valid
          ? ` (${getLocaleName(browserLocaleCode)} unavailable)`
          : ''
      }`}</span>
      <style jsx>{`
        .locale-display-root {
          color: ${COLORS.TEXT_DARK_PRIMARY};
        }
      `}</style>
    </div>
  );
};

LocaleDisplay.propTypes = {};

export default LocaleDisplay;
