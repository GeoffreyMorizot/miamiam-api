import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/auth/CreateUserValidator'

export default class AuthController {
  public async register({ request, auth, response }: HttpContextContract) {
    console.log(request.body())
    const payload = await request.validate(CreateUserValidator)
    const user = await User.create(payload)
    const login = await auth.login(user)
    console.log(user)
    return response.created({
      token: {
        type: login.type,
        token: login.token,
      },
      ...user.serialize({
        relations: {
          roles: {
            fields: ['id'],
          },
        },
      }),
    })
  }

  public async login({ auth, request, response }: HttpContextContract) {
    const { email, password, rememberMe } = request.only(['email', 'password', 'rememberMe'])
    try {
      const token = await auth.attempt(email, password, !!rememberMe)
      const user = auth.user!
      /* response.cookie('token', token.token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
      }) */
      console.log(user)
      return response.ok({
        token,
        ...user.serialize({
          relations: {
            roles: {
              fields: ['id'],
            },
          },
        }),
      })
    } catch {
      return response.badRequest('Invalid credentials')
    }
  }

  public async logout({ auth, response }: HttpContextContract) {
    console.log('logout')
    await auth.logout()
    return response.noContent()
  }

  public me({ auth }: HttpContextContract) {
    return auth.user
  }

  public async check({ auth, response }: HttpContextContract) {
    const authenticated = await auth.check()
    return response.ok({ authenticated })
  }
}
