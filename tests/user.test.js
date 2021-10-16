const request = require('supertest')

const app =  require('../src/setup/app')
const User = require('../src/models/user')


beforeEach(async () => {
    await User.deleteMany() //clear the test database

    //seed with dummy
    await new User({
        name: 'John',
        email: 'jjj@jjj.com',
        password: '123456789'
    })
    .save()
})

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