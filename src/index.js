import express from 'express';
import cors from 'cors';

import Controllers from './controller';

var bodyParser = require('body-parser')

const app = express()
app.use(cors({ origin: '*' }))
app.use(bodyParser.json())

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

app.all('/api/:controller/:id*?', (req, res) => {
  const controller = req.params.controller;
  if (Controllers[controller]) {
    const operation = getOperation(req);
    const data = getData(req);
    if (Controllers[controller][operation]) {
      return Controllers[controller][operation](data, res);
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