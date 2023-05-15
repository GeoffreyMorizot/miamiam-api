import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async index() {
    return User.all()
  }

  public async show({ params }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    return user
  }

  public async update({ params, request }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    user.merge(request.only(['email', 'password']))
    await user.save()
    return user
  }

  public async destroy({ params, auth, response }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const isAuthUser = user.id === auth.user?.id
    if (!isAuthUser) response.unauthorized()
    await user.delete()
  }
}
