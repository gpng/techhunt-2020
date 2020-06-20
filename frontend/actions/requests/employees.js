/* eslint-disable max-classes-per-file */
import axios from 'axios';
import { to } from '../../utils';
// components
import AxioRequest from './Request';
// constants
import { API_HOST } from '../../constants';

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

export class SearchEmployees extends AxioRequest {
  async call(minSalary, maxSalary, sort, offset, limit) {
    const uri = `${API_HOST}/users`;

    const params = {
      minSalary,
      maxSalary,
      sort,
      offset,
      limit,
    };

    const [err, res] = await to(
      axios.get(uri, {
        params,
        cancelToken: this.getCancelToken(),
      }),
    );
    if (!err && res.status === 200 && res.data) {
      return [null, res.data];
    }
    return [err?.response?.data?.message ?? 'server error', null];
  }
}

export class DeleteEmployee extends AxioRequest {
  async call(id) {
    const uri = `${API_HOST}/users/${id}`;

    const [err, res] = await to(
      axios.delete(uri, {
        cancelToken: this.getCancelToken(),
      }),
    );
    if (!err && res.status === 200 && res.data) {
      return [null, res.data];
    }
    return [err?.response?.data?.message ?? 'server error', null];
  }
}
