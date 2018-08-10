import axios from 'axios';
import pathnames from '../../pathnames';

const InfoAxios =  axios.create({
  baseURL: process.env.INFO_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'X-Auth-Token': process.env.INFO_AUTH_TOKEN
  }
});

InfoAxios.interceptors.response.use(
  function (res) {
    return Promise.resolve(res.data);
  },
  function (err) {
    return Promise.reject(err.data);
  }
);

export const getLeagueInfo = (leagueId) => {
  return InfoAxios.get(pathnames.getLeague(leagueId));
};
