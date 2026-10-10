exports.up = async function (knex) {
  await knex.schema.createTable("templates", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.text("description").notNullable();
    table.string("thumbnail_url").notNullable();
    table.string("category").notNullable();
    table.text("features").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("templates");
};
