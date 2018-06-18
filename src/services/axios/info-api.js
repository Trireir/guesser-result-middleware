import axios from 'axios';

export default axios.create({
  baseURL: 'http://api.football-data.org/v1/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'X-Auth-Token': process.env.InfoAuthToken
  }
});