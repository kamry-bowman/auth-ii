exports.up = knex => knex.schema.createTable('users', (users) => {
  users.increments('id');
  users.string('username', 25).unique();
  users.text('hash');
});

exports.down = knex => knex.schema.dropTableIfExists('users');
