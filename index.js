const express = require('express')
const User = require('./models/user')
const Task = require('./models/task')

require('./db/mongoose')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    }catch(err) {
        res.sendStatus(400)
    }
})

app.get('/users', async (req, res) =>{
    try {
        let users = await User.find()
        res.send(users)
    }catch(err) {
        res.sendStatus(500)
    }
})

app.get('/users/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if(!user) return res.sendStatus(404)
        res.send(user)
    }catch(err) {
        res.sendStatus(500)
    }
})

app.patch('/users/:id', async (req, res) => {
    const allowedProperties = ['name', 'email', 'password', 'age']
    const isValidOperation = Object.keys(req.body).every((prop) => { 
        return allowedProperties.includes(prop)
    })

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        let user = User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!user) return res.sendStatus(404)
        res.send(user)
    }catch(err) {
        res.sendStatus(400)
    }
})

app.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

app.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find()
        res.send(tasks)
    }catch(err) {
         res.sendStatus(500)
    }
})

app.get('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id)
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

app.patch('/tasks/:id', async (req, res) => {
    const allowedProperties = ['completed', 'description']
    const isValidOperation = Object.keys(req.body).every((prop) => { 
        return allowedProperties.includes(prop)
    })

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        const task = Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

app.listen(port, () => console.log(`Server is up on port ${port}`) )