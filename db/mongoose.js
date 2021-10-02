const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env['MONGO_STRING'],)

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 1,
        validate(value){
            if(value < 0) throw new Error('Age is negative')
        }
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Email is invalid')
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value){
            if(value.includes('password')) throw Error('Password cannot contain "password"')
        }
        
    }
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        required,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})

new User({name:"Mac", age: 2,  email: 'mike@oo.com', password: 'aaaaaaaaaa'}).save().then(
    () => {console.log('Success')},
    (err) =>  {console.log(err)}
)