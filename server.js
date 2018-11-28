require('dotenv').config();
const express = require('express');
const db = require('knex')(require('./knexfile').development);
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const server = express();
server.use(express.json());
server.use(morgan('dev'));

server.post('/api/register', (req, res) => {
  const { username, password, department } = req.body;
  if (!username || !password || !department ) {
    return res.status(400).json({ message: 'Include all information' });
  }
 
  const hash = bcrypt.hashSync(password, 10); //shortened for development
  return db('users')
    .insert({ username, hash, department })
    .then(([id]) => {
      return res.status(201).json({ id });
    })
    .catch((err) => {
      console.log(err);
      return res.status(422).json({ err });
    });
});

function generateToken(user) {
  const { username, department, userId } = user;
  const options = {
    expiresIn: '1h',
  };
  return jwt.sign({ username, department, userId }, process.env.SECRET, options);
}

server.post('/api/login', (req, res) => {
  const { username, password, } = req.body;
  if (!username || !password ) {
    return res.status(400).json({ message: 'Include all information' });
  }

  return db('users').where('username', username).first()
    .then(({ username, hash, department, id }) => {
      if (username && bcrypt.compareSync(password, hash)) {
        const token = generateToken({ username, department, userId: id });
        return res.status(200).json({ id, username, department, token });
      }
      return res.status(401).json({ message: 'Failed to authenticate' });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json({ err });
    });
});

// server.get('/api/restricted/users', jwt({ secret: 'kam-secret-007' }), (req, res) => {
//   if (req.user && req.user.username) {
//     console.log(req.user.username);
//   }
// });

server.listen(8000, () => {
  console.log('Listening on 8000');
});
