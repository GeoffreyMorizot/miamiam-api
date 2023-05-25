import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: 'virk@adonisjs.com',
        password: 'secret1234',
      },
      {
        email: 'romain@adonisjs.com',
        password: 'secret1234',
      },
    ])
  }
}
