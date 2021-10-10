const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt  = require('jsonwebtoken')

const Task = require('./task')

const userSchema = new mongoose.Schema(
    {
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
            unique: true,
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
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true
    }
)

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'userId'
})

//Get user and verify the sent password with the hashed password in database
userSchema.statics.findByCredentials = async function(email, password){
    const user = await User.findOne({email: email})
    
    if(!user) throw new Error('Unable to login')
    else if(!await bcryptjs.compare(password, user.password)) throw new Error('Unable to login')
    
    return user
}

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({_id: this._id.toString()}, 'Bob')
    return token
}


//removes the password and tokens when sending User info in a response
userSchema.methods.toJSON = function() {
    let publicProfile = this.toObject()
    
    delete publicProfile.password
    delete publicProfile.tokens

    return publicProfile
}

//hash password before saving
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcryptjs.hash(this.password, 8)
    }

    next()
})

//remove user tasks when user is deleted
userSchema.pre('remove', async function(next){
    await Task.deleteMany({userId: this._id})

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User