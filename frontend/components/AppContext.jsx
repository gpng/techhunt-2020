import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
// constants

const initialState = {
  employees: [],
};

const ACTIONS = {};

const AppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    default: {
      // eslint-disable-next-line no-console
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
    }
  }
};

const LocaleProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
};

LocaleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { LocaleProvider, ACTIONS };
export default AppContext;
