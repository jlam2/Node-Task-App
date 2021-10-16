//setup connection with MongoDB
const mongoose = require('mongoose')

const mongoString = process.argv.includes('test') ? process.env['MONGO_STRING_TEST'] : process.env['MONGO_STRING']
mongoose.connect(mongoString)




