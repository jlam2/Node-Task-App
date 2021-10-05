const express = require('express')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(userRouter)
app.use(taskRouter)
app.use(express.json())

app.listen(port, () => console.log(`Server is up on port ${port}`) )