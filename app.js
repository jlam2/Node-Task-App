const express = require('express')

require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()

app.use((req, res, next) => {
    
    next()
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app

