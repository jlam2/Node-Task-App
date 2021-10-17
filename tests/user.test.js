const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose= require('mongoose')

const app =  require('../src/setup/app')
const User = require('../src/models/user')

const testUserId = new mongoose.Types.ObjectId()
const testUser = {
    _id: testUserId,
    name: 'John',
    email: 'jjj@jjj.com',
    password: '123456789',
    tokens: [{
        token: jwt.sign({_id: testUserId}, process.env['JWT_SECRET']) 
    }]
}

beforeEach(async () => {
    await User.deleteMany() //clear the test database
   
    await new User(testUser).save()  //seed with dummy
})

afterAll(async () => await require('mongoose').disconnect() ) //close out open connections after tests

test('Should signup user', async () => {
    await request(app)
        .post('/users')
        .send({
            name: 'Bob',
            email: 'bbb@bbb.com',
            password: '123456789'
        })
        .expect(201)
})

test('Should login existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            name: 'John',
            email: 'jjj@jjj.com',
            password: '123456789'
        })
        .expect(200)
})

test('Should not login non-existing user', async () => {
    await request(app)
        .post('/users/login')
        .send({
            name: 'John',
            email: 'jjj@jjj.com',
            password: '1234567891'
        })
        .expect(400)
})

test('Should get authenticated user profile', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not retrieve unathenticated user', async () => {
    await request(app).get('/users/me').send().expect(401)
})

test('Shoud delete authenticated user account', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${testUser.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await User.findById(testUserId)
    expect(user).toBeNull()
})

test('Shoud not delete unauthenticated user account', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})