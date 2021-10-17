const request = require('supertest')
const mongoose= require('mongoose')

const app =  require('../src/setup/app')
const Task = require('../src/models/task')
const {testUserId, testUser, setupDB} = require('./db/db.js')

beforeEach(async () => {await setupDB()}) //seed database with dummy data
afterAll(async () => await mongoose.disconnect() ) //close out open connections after tests

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send({description: 'Test description'})
        .expect(201)

    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    expect(response.body.length).toEqual(2)
})