export const APP_ACTIONS = {
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
  DELETE: {
    SUBMIT: 'delete_submit',
    LOADING: 'delete_loading',
    LOADED: 'delete_loaded',
  },
  EDIT: {
    SUBMIT: 'edit_submit',
    LOADING: 'edit_loading',
    LOADED: 'edit_loaded',
  },
};

export const closeModal = () => ({ type: APP_ACTIONS.MODAL_CLOSE });

export const openModal = (name, value) => ({
  type: APP_ACTIONS.MODAL_OPEN,
  payload: { name, value },
});

export const submitUploadCSV = (file) => ({
  type: APP_ACTIONS.UPLOAD_CSV.SUBMIT,
  payload: file,
});

export const loadingUploadCSV = () => ({
  type: APP_ACTIONS.UPLOAD_CSV.LOADING,
});

export const loadedUploadCSV = (success, error) => ({
  type: APP_ACTIONS.UPLOAD_CSV.LOADED,
  payload: {
    success,
    error,
  },
});

export const submitSearch = (minSalary, maxSalary, sort, offset, limit) => ({
  type: APP_ACTIONS.SEARCH.SUBMIT,
  payload: { minSalary, maxSalary, sort, offset, limit },
});

export const loadingSearch = () => ({
  type: APP_ACTIONS.SEARCH.LOADING,
});

export const loadedSearch = (results, success, error) => ({
  type: APP_ACTIONS.SEARCH.LOADED,
  payload: {
    results,
    success,
    error,
  },
});

export const submitDelete = (id) => ({
  type: APP_ACTIONS.DELETE.SUBMIT,
  payload: id,
});

export const loadingDelete = () => ({
  type: APP_ACTIONS.DELETE.LOADING,
});

export const loadedDelete = (success, error) => ({
  type: APP_ACTIONS.DELETE.LOADED,
  payload: {
    success,
    error,
  },
});

export const submitEdit = (employee) => ({
  type: APP_ACTIONS.EDIT.SUBMIT,
  payload: employee,
});

export const loadingEdit = () => ({
  type: APP_ACTIONS.EDIT.LOADING,
});

export const loadedEdit = (success, error) => ({
  type: APP_ACTIONS.EDIT.LOADED,
  payload: {
    success,
    error,
  },
});
