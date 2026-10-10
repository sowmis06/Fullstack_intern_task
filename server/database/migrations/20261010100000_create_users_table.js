exports.up = async function (knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("email").notNullable().unique();
    table.string("password_hash").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTable("users");
};
