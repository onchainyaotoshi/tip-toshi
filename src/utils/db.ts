import knex, { Knex } from 'knex';

const db: Knex = knex({
  client: 'postgres',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 80 },
});

const createTipTable = async () => {
  const exists = await db.schema.hasTable('tip');
  if (!exists) {
    await db.schema.createTable('tip', (table) => {
      table.increments('id').primary();
      table.bigInteger('fromFid').notNullable()
      table.bigInteger('toFid').notNullable()
      table.string('hash').notNullable()
      table.string('tx').notNullable()
      table.string('username').notNullable()

      table.timestamp('created_at', { useTz: true }).defaultTo(db.fn.now());
    }).then(() => db.schema.alterTable('tip', (table) => {
      // Assuming 'poll_id' and 'fid' need to be unique together
      table.unique(['fromFid', 'hash']);
    }));

    console.log('Table tip created');
  }
};

export const initialize = async()=>{
  await createTipTable();
}

export default db;