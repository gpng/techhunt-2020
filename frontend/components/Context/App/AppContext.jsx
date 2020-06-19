import React, { useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
// actions
import { PostCSV, SearchEmployees } from '../../../actions/employees';

const initialState = {
  openModal: null,
  upload: {
    loading: false,
    success: false,
    error: null,
  },
  search: {
    employees: [],
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
    LOADED: 'upload_loaded',
  },
  SEARCH: {
    SUBMIT: 'search_submit',
    LOADING: 'search_loading',
    LOADED: 'search_loaded',
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
    case APP_ACTIONS.SEARCH.LOADING:
      return { ...state, search: { employees: [], loading: true, success: false, error: null } };
    case APP_ACTIONS.SEARCH.LOADED:
      return {
        ...state,
        search: {
          employees: action.payload.results,
          loading: false,
          success: action.payload.success,
          error: action.payload.error,
        },
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
  const searchRequest = useRef(new SearchEmployees());

  // store the last search params so we can easily refresh search
  const searchParamsRef = useRef(null);

  /**
   * Used to trigger async actions
   * Wrapped in useCallback to prevent infinite rerenders on child components as it doesn't depend
   * on any state
   */
  const dispatchAsync = useCallback((action) => {
    const searchEmployees = async ({ minSalary, maxSalary, sort, offset, limit }) => {
      searchParamsRef.current = { minSalary, maxSalary, sort, offset, limit };
      searchRequest.current.refresh();
      dispatch({ type: APP_ACTIONS.SEARCH.LOADING });
      const [err, res] = await searchRequest.current.call(
        minSalary,
        maxSalary,
        sort,
        offset,
        limit,
      );
      dispatch({
        type: APP_ACTIONS.SEARCH.LOADED,
        payload: {
          results: res?.results ?? [],
          success: !err,
          error: err,
        },
      });
    };

    const uploadCsv = async (file) => {
      postCsvRequest.current.refresh();
      dispatch({ type: APP_ACTIONS.UPLOAD_CSV.LOADING });
      const [err] = await postCsvRequest.current.call(file);
      dispatch({
        type: APP_ACTIONS.UPLOAD_CSV.LOADED,
        payload: {
          success: !err,
          error: err,
        },
      });
      // refresh search
      if (searchParamsRef.current) {
        searchEmployees(searchParamsRef.current);
      }
    };

    switch (action.type) {
      case APP_ACTIONS.UPLOAD_CSV.SUBMIT:
        uploadCsv(action.payload);
        break;
      case APP_ACTIONS.SEARCH.SUBMIT:
        searchEmployees(action.payload);
        break;
      default:
        dispatch(action);
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, dispatchAsync }}>{children}</AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { AppProvider, APP_ACTIONS };
export default AppContext;
