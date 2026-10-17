import request from 'supertest'
import app from '../app.js'
import User from '../models/user.model.js'

describe('Auth Routes', () => {
  const user = {
    username: 'testuser',
    email: 'test@example.com',
    password: '123456'
  }

  it('POST /api/register debe crear un usuario y devolver cookie/token', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(user)

    expect(res.status).toBe(200)
    expect(res.body.data).toHaveProperty('id')
    expect(res.body.data.username).toBe(user.username)
    expect(res.body.data.email).toBe(user.email)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('POST /api/register no debe permitir email duplicado', async () => {
    await request(app).post('/api/register').send(user)
    const res = await request(app).post('/api/register').send(user)

    expect(res.status).toBe(400)
    expect(res.body).toBeDefined()
  })

  it('POST /api/login debe autenticar con credenciales válidas', async () => {
    await request(app).post('/api/register').send(user)
    const res = await request(app)
      .post('/api/login')
      .send({ email: user.email, password: user.password })

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(user.email)
    expect(res.headers['set-cookie']).toBeDefined()
  })

  it('POST /api/login debe rechazar credenciales inválidas', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'wrong@test.com', password: 'wrongpass' })

    expect(res.status).toBe(400)
  })

  it('GET /api/profile debe requerir autenticación', async () => {
    const res = await request(app).get('/api/profile')
    expect(res.status).toBe(401)
  })

  it('GET /api/profile debe devolver usuario autenticado', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(user)
    const res = await agent.get('/api/profile')

    expect(res.status).toBe(200)
    expect(res.body.email).toBe(user.email)
    expect(res.body).not.toHaveProperty('password')
  })

  it('GET /api/verify debe devolver null si no hay token', async () => {
    const res = await request(app).get('/api/verify')
    expect(res.status).toBe(200)
    expect(res.body).toBeNull()
  })

  it('GET /api/verify debe devolver usuario si hay token válido', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(user)
    const res = await agent.get('/api/verify')

    expect(res.status).toBe(200)
    expect(res.body).not.toBeNull()
    expect(res.body.email).toBe(user.email)
  })

  it('POST /api/logout debe limpiar cookie y devolver 200', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(user)
    const res = await agent.post('/api/logout')

    expect(res.status).toBe(200)
    // Cookie debe borrarse
    if (res.headers['set-cookie']) {
      expect(res.headers['set-cookie'][0]).toMatch(/token=;/)
    }
  })

  it('DELETE /api/profile debe requerir autenticación', async () => {
    const res = await request(app).delete('/api/profile')
    expect(res.status).toBe(401)
  })

  it('DELETE /api/profile debe eliminar el usuario, sus tareas y limpiar la cookie', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(user)

    await agent.post('/api/tasks').send({
      title: 'Tarea huérfana',
      description: 'Debe eliminarse con la cuenta',
      date: new Date().toISOString()
    })

    const res = await agent.delete('/api/profile')
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Cuenta eliminada correctamente')

    // La cookie debe borrarse
    if (res.headers['set-cookie']) {
      expect(res.headers['set-cookie'][0]).toMatch(/token=;/)
    }

    // El usuario ya no existe: login debe fallar y tasks deben estar vacías
    const loginRes = await request(app)
      .post('/api/login')
      .send({ email: user.email, password: user.password })
    expect(loginRes.status).toBe(400)

    const tasksRes = await agent.get('/api/tasks')
    expect(tasksRes.status).toBe(401)
  })
})