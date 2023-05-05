// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  private users = [
    {
      id: 1,
      name: 'John Doe',
    },
    {
      id: 2,
      name: 'Jane Doe',
    },
    {
      id: 3,
      name: 'Jeff Bezos',
    },
  ]

  public async index() {
    console.log('index')
    return this.users
  }
}
