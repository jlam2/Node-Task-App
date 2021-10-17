const jwt = require('jsonwebtoken')
const mongoose= require('mongoose')

const User = require('../../src/models/user')
const Task = require('../../src/models/task')

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

const testUserIdTwo = new mongoose.Types.ObjectId()
const testUserTwo = {
    _id: testUserIdTwo,
    name: 'Nick',
    email: 'kkk@kkk.com',
    password: '123456789',
    tokens: [{
        token: jwt.sign({_id: testUserIdTwo}, process.env['JWT_SECRET']) 
    }]
}

const testTask = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Description 1',
    userId: testUserId
}

const testTaskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Description 2',
    userId: testUserId
}

const testTaskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Test Description 3',
    userId: testUserIdTwo
}

async function setupDB(){
    //clear the test database
    await User.deleteMany() 
    await Task.deleteMany()

    //seed with dummy
    await new User(testUser).save()
    await new User(testUserTwo).save()
    await new Task(testTask).save()
    await new Task(testTaskTwo).save()
    await new Task(testTaskThree).save()
}

module.exports = {testUserId, testUser, setupDB}
