import request from 'supertest'
import app from '../app.js'

describe('Tasks Routes', () => {
  const userA = { username: 'alice', email: 'alice@test.com', password: '12345678' }
  const userB = { username: 'bob', email: 'bob@test.com', password: '12345678' }

  const taskPayload = {
    title: 'Tarea de prueba',
    description: 'Descripción de la tarea',
    date: new Date().toISOString()
  }

  it('GET /api/tasks debe requerir autenticación', async () => {
    const res = await request(app).get('/api/tasks')
    expect(res.status).toBe(401)
  })

  it('POST /api/tasks debe crear una tarea autenticado', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const res = await agent.post('/api/tasks').send(taskPayload)

    expect(res.status).toBe(200)
    expect(res.body.task).toHaveProperty('_id')
    expect(res.body.task.title).toBe(taskPayload.title)
    expect(res.body.task.user).toBeDefined()
  })

  it('POST /api/tasks debe fallar con datos inválidos (Zod)', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const res = await agent.post('/api/tasks').send({ title: '', description: '' })

    expect(res.status).toBe(400)
    expect(Array.isArray(res.body)).toBe(true)
  })

  it('GET /api/tasks debe devolver solo tareas del usuario', async () => {
    const agentA = request.agent(app)
    const agentB = request.agent(app)

    await agentA.post('/api/register').send(userA)
    await agentB.post('/api/register').send(userB)

    await agentA.post('/api/tasks').send({ ...taskPayload, title: 'Tarea A' })
    await agentB.post('/api/tasks').send({ ...taskPayload, title: 'Tarea B' })

    const resA = await agentA.get('/api/tasks')
    const resB = await agentB.get('/api/tasks')

    expect(resA.status).toBe(200)
    expect(resB.status).toBe(200)
    expect(resA.body.tasks).toHaveLength(1)
    expect(resB.body.tasks).toHaveLength(1)
    expect(resA.body.tasks[0].title).toBe('Tarea A')
    expect(resB.body.tasks[0].title).toBe('Tarea B')
  })

  it('GET /api/tasks/:id debe obtener una tarea propia', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const create = await agent.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agent.get(`/api/tasks/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.task._id).toBe(id)
  })

  it('GET /api/tasks/:id debe devolver 404 si no existe o no pertenece', async () => {
    const agentA = request.agent(app)
    const agentB = request.agent(app)

    await agentA.post('/api/register').send(userA)
    await agentB.post('/api/register').send(userB)

    const create = await agentA.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agentB.get(`/api/tasks/${id}`)
    expect(res.status).toBe(404)
  })

  it('PUT /api/tasks/:id debe actualizar tarea propia', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const create = await agent.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agent
      .put(`/api/tasks/${id}`)
      .send({ ...taskPayload, title: 'Actualizada' })

    expect(res.status).toBe(200)
    expect(res.body.task.title).toBe('Actualizada')
  })

  it('PUT /api/tasks/:id debe devolver 404 si tarea no es del usuario', async () => {
    const agentA = request.agent(app)
    const agentB = request.agent(app)

    await agentA.post('/api/register').send(userA)
    await agentB.post('/api/register').send(userB)

    const create = await agentA.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agentB.put(`/api/tasks/${id}`).send(taskPayload)
    expect(res.status).toBe(404)
  })

  it('DELETE /api/tasks/:id debe eliminar tarea propia', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const create = await agent.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agent.delete(`/api/tasks/${id}`)
    expect(res.status).toBe(200)
    expect(res.body.message).toBeDefined()
  })

  it('DELETE /api/tasks/:id debe devolver 404 si no pertenece al usuario', async () => {
    const agentA = request.agent(app)
    const agentB = request.agent(app)

    await agentA.post('/api/register').send(userA)
    await agentB.post('/api/register').send(userB)

    const create = await agentA.post('/api/tasks').send(taskPayload)
    const id = create.body.task._id

    const res = await agentB.delete(`/api/tasks/${id}`)
    expect(res.status).toBe(404)
  })

  it('GET /api/tasks/:id con ID inválido debe devolver 400 (CastError)', async () => {
    const agent = request.agent(app)
    await agent.post('/api/register').send(userA)
    const res = await agent.get('/api/tasks/invalid-id')
    expect(res.status).toBe(400)
  })
})