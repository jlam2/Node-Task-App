//setup express and mongoose
const express = require('express')
const mongoose = require('mongoose')

const mongoString = process.argv.includes('test') ? process.env['MONGO_STRING_TEST'] : process.env['MONGO_STRING']
mongoose.connect(mongoString)

const userRouter = require('../routers/user')
const taskRouter = require('../routers/tasks')

const app = express()

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app

