import express from 'express';
import cors from 'cors';

import Controllers from './controller';
import AxiosHALO from './services/axios/halo-api';
import pathnames from './pathnames';

var bodyParser = require('body-parser')

const app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())
app.use(async function (req, res, next) {
  const authToken = process.env.AUTH_TOKEN;
  const authTokenExpiration = process.env.AUTH_TOKEN_EXPIRATION;
  if(!authToken || new Date() > authTokenExpiration) {
    try {
      const res = await AxiosHALO.post(pathnames.getToken(), {
        username: process.env.HALO_USERNAME,
        password: process.env.HALO_PASSWORD,
        grant_type: 'password',
      });
  
      process.env.AUTH_TOKEN = res.data.access_token;
      process.env.AUTH_TOKEN_EXPIRATION = new Date().getTime() + res.data.expires_in;
    } catch (err) {
      res.status(401).json({
        message: 'HALO Credentials not valid',
        extra: err
      });
    }
  }
  next();
});

function getData (req) {
  let data = {};
  if(req.query) {
    data = {
      ...data,
      ...req.query,
    };
  }
  if(req.body) {
    data = {
      ...data,
      ...req.body,
    };
  }
  if(req.params) {
    data = {
      ...data,
      ...req.params,
    };
  }
  return data;
}

function getOperation (req) {
  let operation = '';
  switch (req.method) {
    case 'GET':
      if(req.params.id) {
        operation = 'get';
      } else {
        operation = 'list';
      }
      break;
    case 'POST':
      if(req.params.id) {
        operation = 'update';
      } else {
        operation = 'create';
      }
      break;
    case 'PUT':
      operation = 'update';
      break;
    case 'DELETE':
      operation = 'delete';
      break;
  }

  return operation;
}

app.all('/api/:controller/:id*?', (req, res, next) => {
  const controller = req.params.controller;
  if (Controllers[controller]) {
    const operation = getOperation(req);
    const data = getData(req);
    if (Controllers[controller][operation]) {
      return Controllers[controller][operation](data)
      .then((result) => {
        res.status(200).json(result);
      }).catch((err) => {
        const status = err.status || 500;
        delete err.status;
        res.status(status).json(err);
      });
    }
  }
  return res.status(400).json({
    message: 'Operation not valid.',
  });
});

app.all('*', (req, res) => {
  return res.status(400).json({
    message: 'Operation not valid.',
  })
});

app.listen(process.env.PORT || 3333, function () {
  console.log(`Listening on ${process.env.PORT || 3333} port`);
});