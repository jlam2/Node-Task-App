const jwt = require('jsonwebtoken')
const mongoose= require('mongoose')

const User = require('../../src/models/user')

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

async function setupDB(){
    await User.deleteMany() //clear the test database
    await new User(testUser).save()  //seed with dummy
}

module.exports = {testUserId, testUser, setupDB}
