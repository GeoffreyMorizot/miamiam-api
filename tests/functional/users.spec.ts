import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories/UserFactory'

test.group('Users', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction('mysql')
    return () => Database.rollbackGlobalTransaction('mysql')
  })

  test('should return logged user', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const response = await client.get('/api/auth/me').loginAs(user)
    response.assertStatus(200)
    assert.equal(response.body().id, user.id)
  })

  test('should return authenticated to true if user is authenticated', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.get('/api/auth/check').loginAs(user)
    response.assertStatus(200)
    response.assertBody({ authenticated: true })
  })

  test('should return authenticated to false if user is not authenticated', async ({ client }) => {
    const response = await client.get('/api/auth/check')
    response.assertStatus(200)
    response.assertBody({ authenticated: false })
  })

  test('should return all users', async ({ client }) => {
    const users = await UserFactory.createMany(3)
    const response = await client.get('/api/users').loginAs(users[0])
    response.assertStatus(200)
    response.assertBodyContains([{ id: users[0].id }, { id: users[1].id }, { id: users[2].id }])
  })

  test('should return a user', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.get(`/api/users/${user.id}`).loginAs(user)
    response.assertStatus(200)
    response.assertBodyContains({ id: user.id })
  })

  test('should update a user', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.put(`/api/users/${user.id}`).loginAs(user).json({
      email: 'update@example.com',
    })
    response.assertStatus(200)
    response.assertBodyContains({
      id: user.id,
      email: 'update@example.com',
    })
  })

  test('should delete the account if the owner', async ({ client }) => {
    const user = await UserFactory.create()
    const response = await client.delete(`/api/users/${user.id}`).loginAs(user)
    response.assertStatus(200)
  })

  test('should not delete the account if it is not the owner', async ({ client }) => {
    const users = await UserFactory.createMany(2)
    const response = await client.delete(`/api/users/${users[0].id}`).loginAs(users[1])
    response.assertStatus(401)
  })
})

test.group('Users | Register', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction('mysql')
    return () => Database.rollbackGlobalTransaction('mysql')
  })

  test('should register a new user', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'geoffrey@example.com',
      password: 'secret1234',
      password_confirmation: 'secret1234',
    })
    response.assertStatus(201)
  })

  test('should not register a new user with an existing email', async ({ client }) => {
    await UserFactory.merge({ email: 'geoffrey@example.com' }).create()
    const response = await client.post('/api/auth/register').json({
      email: 'geoffrey@example.com',
      password: 'secret1234',
      password_confirmation: 'secret1234',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          rule: 'unique',
          message: 'An account already exists with the provided email.',
        },
      ],
    })
  })

  test('should not register a new user with an invalid email', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'geoffrey',
      password: 'secret1234',
      password_confirmation: 'secret1234',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          rule: 'email',
          message: 'Your email is not valid.',
        },
      ],
    })
  })

  test('should not register a new user with a password that is too short', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'geoffrey',
      password: 'secret',
      password_confirmation: 'secret',
    })

    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'password',
          rule: 'minLength',
          message: 'Your password needs to be at least 8 characters long.',
        },
      ],
    })
  })

  test('should not register a new user with a password that does not match the password confirmation', async ({
    client,
  }) => {
    const response = await client.post('/api/auth/register').json({
      email: 'geoffrey',
      password: 'secret1234',
      password_confirmation: 'secret123',
    })
    response.assertBodyContains({
      errors: [
        {
          field: 'password_confirmation',
          rule: 'confirmed',
          message: 'Passwords do not match.',
        },
      ],
    })
  })

  test('should not register a new user with missing data', async ({ client }) => {
    const response = await client.post('/api/auth/register').json({
      email: '',
      password: '',
      password_confirmation: '',
    })
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          rule: 'required',
          message: 'You need to specify an email.',
        },
        {
          field: 'password',
          rule: 'required',
          message: 'You need to specify a password.',
        },
      ],
    })
  })
})
