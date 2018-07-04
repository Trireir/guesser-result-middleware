import axios from 'axios';
import pathnames from '../../pathnames';

let token;
let expirationDate;

export const getAuthToken = async () => {
  if(!token || new Date() > expirationDate) {
    const res = await AxiosHALO.post(pathnames.getToken(), {
      username: process.env.HALO_USERNAME,
      password: process.env.HALO_PASSWORD,
      grant_type: 'password',
    });

    token= res.data.access_token,
    expirationDate = new Date().getTime() + res.data.expires_in
  }
  return token;
}

export const AxiosHALO = axios.create({
  baseURL: 'https://halo-stage.mobgen.com/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  }
});