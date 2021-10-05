const express = require('express')
const router = express.Router()
const Task = require('../models/task')

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.status(201).send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        let tasks = await Task.find()
        res.send(tasks)
    }catch(err) {
         res.sendStatus(500)
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id)
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const allowedProperties = ['completed', 'description']
    const isValidOperation = Object.keys(req.body).every((prop) => { 
        return allowedProperties.includes(prop)
    })

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        let task = await Task.findByIdAndDelete(req.params.id)
        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router