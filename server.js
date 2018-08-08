const express = require('express');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('knex')(require('./knexfile').development);

const server = express();
server.use(express.json());
server.use(morgan('dev'));

server.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then(hash => db('users').insert({ username, hash }))
    .then((id) => {
      const token = jwt.sign({ username }, 'kam-secret-007', { expiresIn: '24h' });
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
        const token = jwt.sign({ username }, 'kam-secret-007', { expiresIn: '24h' });
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
  jwt.verify(authorization.slice(7), 'kam-secret-007', (verdict) => {
    if (verdict) {
      db('users')
        .select('usernames')
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

server.listen(8000, () => {
  console.log('Listening on 8000');
});
