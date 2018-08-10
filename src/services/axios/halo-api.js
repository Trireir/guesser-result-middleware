import axios from 'axios';
import pathnames from '../../pathnames';

let token;

const AxiosHALO = axios.create({
  baseURL: process.env.HALO_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
});

AxiosHALO.interceptors.response.use(
  res => (Promise.resolve(res.data)),
  (err) => {
    if (err && err.response && err.response.status === 401 && !err.config._retry) {
      const originalRequest = err.config;
      originalRequest._retry = true;
      return AxiosHALO.post(pathnames.getToken(), {
        username: process.env.HALO_USERNAME,
        password: process.env.HALO_PASSWORD,
        grant_type: 'password',
      }).then((data) => {
        token = data.access_token;
        AxiosHALO.defaults.headers.common.Authorization = `Bearer ${token}`;
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return AxiosHALO(originalRequest);
      }).catch(Promise.reject);
    }
    return Promise.reject(err.response.data);
  },
);

export const searchItems = async filter => (
  AxiosHALO.post('generalcontent/instance/search', filter)
);

export const saveItems = (name, module, values) => (
  AxiosHALO.post('generalcontent/instance', {
    module,
    name,
    values,
  })
);
