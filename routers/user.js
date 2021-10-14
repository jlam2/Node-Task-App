const express = require('express')
const multer = require('multer')

const User = require('../models/user')
const auth = require('../middleware/authentication')

const router = express.Router()
const upload = multer({
    dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error("Only images are supported"))

        cb(undefined, true)
        
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token: token})
        await user.save()
        
        res.status(201).send({user: user, token: token})
    }catch(err) {
        res.sendStatus(400)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token: token})
        await user.save()

        res.send({user: user, token: token})
    }catch(err) {
        res.sendStatus(400)
    }
})

router.post('/users/logout',  auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !==  req.token )
        await req.user.save()

        res.send(req.user)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send(req.user)
    }catch(err) {
        res.sendStatus(500)
    }
})

router.post('/users/me/avatar', 
    upload.single('avatar'), 
    (req, res) => {
        res.sendStatus(200)
    }, 
    (err, req, res, next) => {
        res.status(400).send(err)
    }
)

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

// router.get('/users/:id', async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if(!user) return res.sendStatus(404)
//         res.send(user)
//     }catch(err) {
//         res.sendStatus(500)
//     }
// })

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedProperties = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((prop) => allowedProperties.includes(prop))

    if(!isValidOperation) return res.status(400).send({error: 'Invalid properties in update'})

    try {
        //const user = await User.findById(req.params.id)
        //if(!user) return res.sendStatus(404)

        const user = req.user

        updates.forEach((update) => user[update] = req.body[update])
        await user.save()
        
        res.send(user)
    }catch(err) {
        res.sendStatus(400)
    }
})

router.delete('/users/me', auth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.user._id)
        
        if(!user) return res.sendStatus(404)
        res.send(user)
    }catch(err) {
        res.sendStatus(500)
    }
})

module.exports = router