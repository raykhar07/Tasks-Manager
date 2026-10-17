import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { vi } from 'vitest'

let mongoServer

export async function connectDBTest() {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
}

export async function disconnectDBTest() {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
  await mongoServer?.stop()
}

export async function clearDB() {
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}

// Setup global
beforeAll(async () => {
  await connectDBTest()
})

afterEach(async () => {
  await clearDB()
})

afterAll(async () => {
  await disconnectDBTest()
})