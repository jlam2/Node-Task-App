const request = require('supertest')
const mongoose= require('mongoose')

const app =  require('../src/setup/app')
const Task = require('../src/models/task')
const {testUserId, testUser, setupDB} = require('./db/db.js')

beforeEach(async () => {await setupDB()}) //seed database with dummy data
afterAll(async () => await mongoose.disconnect() ) //close out open connections after tests

test('Should create task for user', async () => {
    const respone = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({description: 'Test description'})
        .expect(201)
})