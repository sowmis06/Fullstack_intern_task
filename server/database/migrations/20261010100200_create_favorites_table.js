exports.up = async function (knex) {
  await knex.schema.createTable("favorites", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("template_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("templates")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());

    table.unique(["user_id", "template_id"]);
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("favorites");
};
