import React, { useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
// actions
import { PostCSV } from '../../../actions/employees';

const initialState = {
  employees: [],
  openModal: null,
  upload: {
    loading: false,
    success: false,
    error: null,
  },
};

const APP_ACTIONS = {
  MODAL_CLOSE: 'modal_close',
  MODAL_OPEN: 'modal_open',
  UPLOAD_CSV: {
    SUBMIT: 'upload_submit',
    LOADING: 'upload_loading',
    LOADED: 'loaded',
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    // modals
    case APP_ACTIONS.MODAL_CLOSE:
      return { ...state, openModal: action.payload };
    case APP_ACTIONS.MODAL_OPEN:
      return { ...state, openModal: null };
    // uploading csv
    case APP_ACTIONS.UPLOAD_CSV.LOADING:
      return { ...state, upload: { loading: true, success: false, error: null } };
    case APP_ACTIONS.UPLOAD_CSV.LOADED:
      return {
        ...state,
        upload: { loading: false, success: action.payload.success, error: action.payload.error },
      };
    default: {
      // eslint-disable-next-line no-console
      console.warn(
        `Unhandled action type: ${action.type}, check if you should be using dispatchAsync`,
      );
      return state;
    }
  }
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const postCsvRequest = useRef(new PostCSV());

  const uploadCsv = async (file) => {
    // postCsvRequest.current.refresh();
    dispatch({ type: APP_ACTIONS.UPLOAD_CSV.LOADING });
    const [err] = await postCsvRequest.current.call(file);
    dispatch({
      type: APP_ACTIONS.UPLOAD_CSV.LOADED,
      payload: {
        success: !err,
        error: err,
      },
    });
  };

  /**
   * Used to trigger async actions
   */
  const dispatchAsync = (action) => {
    switch (action.type) {
      case APP_ACTIONS.UPLOAD_CSV.SUBMIT:
        uploadCsv(action.payload);
        break;
      default:
        dispatch(action);
    }
  };

  return (
    <AppContext.Provider value={{ state, dispatch, dispatchAsync }}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProvider, APP_ACTIONS };
export default AppContext;
