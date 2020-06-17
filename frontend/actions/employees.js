/* eslint-disable max-classes-per-file */
import axios from 'axios';
import { to } from '../utils';
// components
import AxioRequest from './Request';
// constants
import { API_HOST } from '../constants';

// eslint-disable-next-line import/prefer-default-export
export class PostCSV extends AxioRequest {
  async call(csvFile) {
    const uri = `${API_HOST}/users/upload`;

    const formData = new FormData();
    formData.append('file', csvFile);

    const [err, res] = await to(
      axios.post(uri, formData, {
        cancelToken: this.getCancelToken(),
        headers: {
          'content-type': 'multipart/form-data',
        },
      }),
    );
    if (!err && res.status === 200 && res.data) {
      return [null, res.data];
    }
    return [err?.response?.data?.message ?? 'server error', null];
  }
}
