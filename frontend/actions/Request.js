import axios from 'axios';

export default class AxiosRequest {
  constructor() {
    this.refreshToken();
  }

  getCancelToken() {
    return this.cancelToken.token;
  }

  cancel() {
    this.cancelToken.cancel();
  }

  refreshToken() {
    this.cancelToken = axios.CancelToken.source();
  }

  refresh() {
    this.cancel();
    this.refreshToken();
  }
}
