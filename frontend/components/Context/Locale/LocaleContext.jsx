import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
// constants
import { LOCALES } from '../../../translations';

const LocaleContext = React.createContext({});

const LOCALE_ACTIONS = {
  UPDATE: 'update',
};

const localeReducer = (state, action) => {
  switch (action.type) {
    case LOCALE_ACTIONS.UPDATE: {
      return { locale: action.payload };
    }
    default: {
      // eslint-disable-next-line no-console
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
    }
  }
};

const isValidLocale = (locale) => Object.values(LOCALES).includes(locale);

const LocaleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(localeReducer, { locale: LOCALES.DEFAULT });

  const router = useRouter();

  useEffect(() => {
    let locale = null;
    const routerLocale = router.query.locale;
    if (routerLocale && isValidLocale(routerLocale)) {
      locale = routerLocale;
    }
    if (!locale) {
      // get browser locale only if no specified locale
      const browserLocale = window?.navigator?.language?.slice?.(0, 2);
      if (browserLocale && isValidLocale(browserLocale)) {
        locale = browserLocale;
      }
    }
    if (!locale) locale = LOCALES.DEFAULT;
    dispatch({ type: LOCALE_ACTIONS.UPDATE, payload: locale });
  }, [router.query.locale]);

  return <LocaleContext.Provider value={state}>{children}</LocaleContext.Provider>;
};

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { LocaleProvider, LOCALES };
export default LocaleContext;
