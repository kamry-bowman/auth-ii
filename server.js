const express = require('express');
const db = require('knex')(require('./knexfile').development);
const morgan = require('morgan');
const jwt = require('express-jwt');
const bcrypt = require('bcrypt');

const server = express();
server.use(express.json());
server.use(morgan('dev'));

server.post('/api/login', (req, res) => {
  const { name, password } = req.body;
  
});

server.get('/api/restricted/users', jwt({ secret: 'kam-secret-007' }), (req, res) => {
  if (req.user && req.user.username) {
    console.log(req.user.username);
  }
});

server.listen(8000, () => {
  console.log('Listening on 8000');
});
