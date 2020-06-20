import React, { useReducer, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
// actions
import { PostCSV, SearchEmployees, DeleteEmployee } from '../../../actions/requests/employees';
import {
  APP_ACTIONS,
  loadedUploadCSV,
  loadingSearch,
  loadedSearch,
  loadingUploadCSV,
  loadingDelete,
  loadedDelete,
} from '../../../actions/creators';

const initialState = {
  modal: {
    name: null,
    value: null,
  },
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
  delete: {
    id: null,
    loading: false,
    success: false,
    error: null,
  },
};

// move this to it's own file when it gets larger
const reducer = (state, action) => {
  switch (action.type) {
    // modals
    case APP_ACTIONS.MODAL_OPEN:
      return { ...state, modal: action.payload };
    case APP_ACTIONS.MODAL_CLOSE:
      return {
        ...state,
        modal: { name: null, value: null },
        upload: {
          loading: false,
          success: false,
          error: null,
        },
        delete: {
          id: null,
          loading: false,
          success: false,
          error: null,
        },
      };
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
    case APP_ACTIONS.DELETE.LOADING:
      return { ...state, delete: { loading: true, success: false, error: null } };
    case APP_ACTIONS.DELETE.LOADED:
      return {
        ...state,
        delete: { loading: false, success: action.payload.success, error: action.payload.error },
      };
    default: {
      // eslint-disable-next-line no-console
      console.warn(`Unhandled action type: ${action.type}`);
      return state;
    }
  }
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const postCsvRequest = useRef(new PostCSV());
  const searchRequest = useRef(new SearchEmployees());
  const deleteRequest = useRef(new DeleteEmployee());

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
      dispatch(loadingSearch());
      const [err, res] = await searchRequest.current.call(
        minSalary,
        maxSalary,
        sort,
        offset,
        limit,
      );
      dispatch(loadedSearch(res?.results ?? [], !err, err));
    };

    const uploadCsv = async (file) => {
      postCsvRequest.current.refresh();
      dispatch(loadingUploadCSV());
      const [err] = await postCsvRequest.current.call(file);
      dispatch(loadedUploadCSV(!err, err));
      // refresh search
      if (searchParamsRef.current) {
        searchEmployees(searchParamsRef.current);
      }
    };

    const deleteEmployee = async (id) => {
      postCsvRequest.current.refresh();
      dispatch(loadingDelete());
      const [err] = await deleteRequest.current.call(id);
      dispatch(loadedDelete(!err, err));
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
      case APP_ACTIONS.DELETE.SUBMIT:
        deleteEmployee(action.payload);
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

export { AppProvider };
export default AppContext;
