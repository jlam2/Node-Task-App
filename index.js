const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const user = new User(req.body)
    user.save().then(() => {
        res.send(user)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

app.post('/tasks', (req, res) => {
    const task = new Task(req.body)
    user.save().then(() => {
        res.send(task)
    }).catch((err) => {
        res.status(400).send(task)
    })
})


app.listen(port, () => console.log(`Server is up on port ${port}`) )