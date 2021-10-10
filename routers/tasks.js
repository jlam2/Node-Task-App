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

//query: completed=boolean, limit=Number, skip=Number, sortBy=<createdAt || completed>_<asc || dec>
router.get('/tasks', auth, async (req, res) => {
    const match = {userId: req.user._id}
    const options = {}

    if(req.query.completed) match.completed = req.query.completed === 'true'

    if(req.query.limit) options.limit = parseInt(req.query.limit)
    if(req.query.skip) options.skip = parseInt(req.query.skip)
    if(req.query.sortBy){
        const parts = req.query.sortBy.split('_')
        options.sort = {[parts[0]]: parts[1]}
    } 
    
    try {
        //await req.user.populate('tasks').execPopulate()
        //const tasks = req.user.tasks

        const tasks = await Task.find(match, null, options)
        res.send(tasks)
    }catch(err) {
         res.sendStatus(500)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id})

        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProperties = ['completed', 'description']
    const isValidOperation = updates.every((prop) => allowedProperties.includes(prop))

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        //const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id: req.params.id, userId: req.user._id})

        if(!task) return res.sendStatus(404)

        updates.forEach((update) => task[update] = req.body[update])
        task.save()
        
        res.send(task)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id: req.params.id, userId: req.user._id})

        if(!task) return res.sendStatus(404)
        res.send(task)
    }catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router