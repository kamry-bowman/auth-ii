const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const db = require('knex')(require('./knexfile').development);

const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 8000;
const secret = process.env.SECRET || 'secretWithSevenSssssss';

const server = express();
server.use(express.json());
server.use(morgan('dev'));

server.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hash => db('users').insert({ username, hash }))
    .then((id) => {
      const token = jwt.sign({ username }, secret, { expiresIn: '24h' });
      res.status(200).json(token);
    })
    .catch((err) => {
      console.log('An error occurred', err);
      res.status(400).json({ message: 'We were unable to register this user successfully' });
    });
});

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  db('users')
    .select('hash')
    .where('username', '=', username)
    .first()
    .then(({ hash }) => bcrypt.compare(password, hash))
    .then((verdict) => {
      if (verdict) {
        const token = jwt.sign({ username }, secret, { expiresIn: '24h' });
        res.status(200).json(token);
      } else {
        res.status(406).json({ message: 'System could not log user in.' });
      }
    })
    .catch((err) => {
      console.log('An error occurred', err);
      res.status(400).json({ message: 'An error occurred when attempting log-in.' });
    });
});

server.get('/api/restricted/users', (req, res) => {
  const { authorization } = req.headers;
  jwt.verify(authorization, secret, (err, decoded) => {
    if (!err) {
      db('users')
        .select('username')
        .then((usernames) => {
          return res.status(200).json(usernames);
        })
        .catch((err) => {
          console.log(`Error: ${err}`);
          return res.status(500).json({ message: 'Could not obtain requested data' });
        })
    } else {
      res.status(406).json({ message: 'System could not log user in.' });
    }
  });
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
