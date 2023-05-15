import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/auth/CreateUserValidator'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)
    const user = await User.create(payload)
    const { token } = await auth.login(user)
    console.log(token)
    return response.created({
      token,
      ...user.serialize(),
    })
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const email: string = request.input('email')
    const password: string = request.input('password')

    try {
      const token = await auth.attempt(email, password)
      const user = auth.user!

      return response.ok({
        token,
        ...user,
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    await auth.logout()
    return response.noContent()
  }

  public async me({ auth }: HttpContextContract) {
    return auth.user
  }

  public async check({ auth, response }: HttpContextContract) {
    const authenticated = await auth.check()
    return response.ok({ authenticated })
  }
}
