
exports.up = function(knex, Promise) {
  return knex.schema.table("tags", function(t) {
    return t.string('project').notNull();
  }).then(() => {
    return knex('tags').update({ project: "NO PROJECT" });
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table("tags", function(t) {
    t.dropColumn('project');
  });
};
