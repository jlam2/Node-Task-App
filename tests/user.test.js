const request = require('supertest')

const app =  require('../src/app.js')
const User = requre('../src/models/user')


beforeEach(() => {

})

test('Should signup user', () => {
    await request(app)
        .post('/users')
        .send({
            name: 'John',
            email: 'jjj@jjj.com',
            password: '123456789'
        })
        .expect(201)
})