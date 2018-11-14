
exports.up = function(knex, Promise) {
  return knex.schema.createTable("tags", function(t) {
    t.increments('id').unsigned().primary();
    t.string('name').notNull();
    t.dateTime('created_at').notNull();
    t.dateTime('updated_at').nullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tags');
};
