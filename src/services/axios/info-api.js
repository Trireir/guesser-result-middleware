import axios from 'axios';
import pathnames from '../../pathnames';

const InfoAxios = axios.create({
  baseURL: process.env.INFO_BASE_URL,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'X-Auth-Token': process.env.INFO_AUTH_TOKEN,
  },
});

InfoAxios.interceptors.response.use(
  res => (Promise.resolve(res.data)),
  err => (Promise.reject(err.data)),
);

export const getLeagueInfo = (leagueId) => {
  return InfoAxios.get(pathnames.getLeague(leagueId));
};

export const getLeagueMatches = leagueId => (
  InfoAxios.get(pathnames.getMatches(leagueId))
);
