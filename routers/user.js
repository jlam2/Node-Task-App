const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.get('/users', async (req, res) =>{
    try {
        let users = await User.find()
        res.send(users)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.get('/users/:id', async (req, res) => {
    try {
        let user = await User.findById(req.params.id)
        if(!user) return res.sendStatus(404)
        res.send(user)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProperties = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((prop) => allowedProperties.includes(prop))

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        let user = await User.findById(req.params.id)

        if(!user) return res.sendStatus(404)

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        res.send(user)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.delete('/users/:id', async (req, res) => {
    try {
        let user = await User.findByIdAndDelete(req.params.id)
        if(!user) return res.sendStatus(404)
        res.send(user)
    }catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router