import axios from 'axios';
import pathnames from '../../pathnames';

let token;
let expirationDate;

const getAuthToken = async () => {
  if(!token || new Date().getTime() > expirationDate) {
    const res = await AxiosHALO.post(pathnames.getToken(), {
      username: process.env.HALO_USERNAME,
      password: process.env.HALO_PASSWORD,
      grant_type: 'password',
    });

    token = res.data.access_token,
    expirationDate = new Date().getTime() + res.data.expires_in
  }
  return token;
}

const AxiosHALO = axios.create({
  baseURL: process.env.HALO_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
});

AxiosHALO.interceptors.response.use(
  function (res) {
    return Promise.resolve(res.data);
  },
  function (err) {
    if (err && err.response && err.response.status === 401 && !err.config._retry) {
      const originalRequest = err.config;
      originalRequest._retry = true;
      return AxiosHALO.post(pathnames.getToken(), {
        username: process.env.HALO_USERNAME,
        password: process.env.HALO_PASSWORD,
        grant_type: 'password',
      }).then((data) => {
        token = data.access_token;
        expirationDate = new Date().getTime() + data.expires_in;
        AxiosHALO.defaults.headers.common['Authorization'] = 'Bearer ' + token;
        originalRequest.headers['Authorization'] = 'Bearer ' + token;
        return AxiosHALO(originalRequest);
      }).catch((err) => ( Promise.reject(err)));
    }
    return Promise.reject(err.response.data);
  }
);

export const saveItems = () => {
  return AxiosHALO.get('generalcontent/instance');
}