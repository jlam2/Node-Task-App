const express = require('express')
const router = express.Router()
const Task = require('../models/task')
const auth = require('../middleware/authentication')

router.post('/tasks', auth, async (req, res) => {
    //const task = new Task(req.body)

    const task = new Task({
        userId: req.user._id,
        ...req.body
    })

    try {
        await task.save()
        res.status(201).send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find()
        res.send(tasks)
    }catch(err) {
         res.sendStatus(500)
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProperties = ['completed', 'description']
    const isValidOperation = updates.every((prop) => allowedProperties.includes(prop))

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        const task = await Task.findById(req.params.id)

        if(!task) return res.sendStatus(404)

        updates.forEach((update) => task[update] = req.body[update])
        task.save()
        res.send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router