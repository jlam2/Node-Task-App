const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const User = require('../models/user')
const auth = require('../middleware/authentication')
const email = require('../email/email')

const router = express.Router()
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) return cb(new Error("Only images are supported"))

        cb(undefined, true)
    },
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        const token = await user.generateAuthToken()
        user.tokens = user.tokens.concat({token: token})

        await user.save()

        email.sendWelcomeEmail(user.email, user.name)

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

        email.sendCancellationEmail(user.email, user.name)
        res.send(user)
    }catch(err) {
        res.sendStatus(500)
    }
})

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

router.post('/users/me/avatar',
    auth,
    upload.single('avatar'), 
    async (req, res) => {
        //req.user.avatar = req.file.buffer
        req.user.avatar = await sharp(req.file.buffer).resize({width: 500, height: 500}).png().toBuffer()
        await req.user.save()

        res.sendStatus(200)
    }, 
    (err, req, res, next) => {
        res.status(400).send(err)
    }
)

router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()

    res.sendStatus(200)
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar) throw new Error()

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(err) {
        res.sendStatus(404)
    }
})

module.exports = router