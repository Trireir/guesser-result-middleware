import axios from 'axios';

export default axios.create({
  baseURL: 'https://halo-stage.mobgen.com/api/',
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  }
});