import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.dateTime('created_at', { useTz: true }).notNullable()
      table.dateTime('updated_at', { useTz: true }).notNullable()

      table.string('email', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('remember_me_token').nullable()

      table
        .integer('role_id')
        .unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('CASCADE')
        .defaultTo(1)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
