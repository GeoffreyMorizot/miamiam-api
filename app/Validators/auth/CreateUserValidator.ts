import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string([
      rules.email(),
      rules.lowercase(),
      rules.trim(),
      rules.unique({ table: 'users', column: 'email' }),
      rules.maxLength(255),
    ]),
    password: schema.string([rules.minLength(8), rules.maxLength(30), rules.confirmed()]),
  })

  public messages: CustomMessages = {
    'email.required': 'You need to specify an email.',
    'email.unique': 'An account already exists with the provided email.',
    'email.maxLength': 'Your email cannot be longer than 255 characters.',
    'email.email': 'Your email is not valid.',
    'password.required': 'You need to specify a password.',
    'password.minLength': 'Your password needs to be at least 8 characters long.',
    'password.maxLength': 'Your password cannot be longer than 30 characters.',
    'password_confirmation.confirmed': 'Passwords do not match.',
  }
}
