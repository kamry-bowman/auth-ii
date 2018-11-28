
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', tbl => tbl
    .string('department'));
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', tbl => tbl.dropColumn('department'));
};
