const mongoose = require('mongoose')

mongoose.connect(process.env['MONGO_STRING'],)

const User = mongoose.model('User', {
    name: {
        type: String
    },
    age: {
        type: Number
    }
})

new User({name:"Mac", age: 34}).save().then(() => {console.log('Success')})