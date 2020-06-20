/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react';
import RouterMock from './RouterMock';
import { LocaleProvider } from '../../components/Context/Locale/LocaleContext';
import AppContext, { AppProvider } from '../../components/Context/App/AppContext';

const renderWithContext = (component) => {
  return {
    ...render(
      <RouterMock>
        <LocaleProvider>
          <AppProvider>{component}</AppProvider>
        </LocaleProvider>
      </RouterMock>,
    ),
  };
};

const renderWithCustomAppContext = (component, appProps) => {
  return {
    ...render(
      <RouterMock>
        <LocaleProvider>
          <AppContext.Provider {...appProps}>{component}</AppContext.Provider>
        </LocaleProvider>
      </RouterMock>,
    ),
  };
};

export { renderWithContext, renderWithCustomAppContext };
