import React from 'react';
// contexts
import { LocaleProvider } from '../components/Context/Locale/LocaleContext';
import { AppProvider } from '../components/Context/App/AppContext';
// components
import ModalContainer from '../components/Modals/ModalContainer';
// constants
import { COLORS } from '../constants/styles';
// styles
import 'typeface-lato';
import 'normalize.css';

// eslint-disable-next-line react/prop-types
const App = ({ Component, pageProps }) => (
  <LocaleProvider>
    <AppProvider>
      <>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
        <ModalContainer />
        <style jsx global>{`
          html,
          body,
          #__next {
            height: 100%;
          }

          *,
          *:before,
          *:after {
            box-sizing: border-box;
          }

          html {
            font-size: 16px;
          }

          body {
            font-family: Lato, BlinkMacSystemFont, -apple-system, Segoe UI, Helvetica Neue,
              Helvetica, Arial, sans-serif;
            background: ${COLORS.BACKGROUND_PRIMARY};
            color: ${COLORS.TEXT_PRIMARY};
          }

          p {
            margin: 0;
          }

          button {
            cursor: pointer;
            outline: none;
          }
        `}</style>
      </>
    </AppProvider>
  </LocaleProvider>
);

export default App;
