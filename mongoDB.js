const mongoClient = require('mongodb').MongoClient
const databasename = 'TaskApp'

mongoClient.connect(process.env['MONGO_STRING'], {useNewUrlParser: true}, (err, client) => {
    if(err) return console.log(err);
    console.log('Connected to MongoDB')

    const db = client.db(databasename)

    // db.collection('users').insertMany([{name:'Bob'},{age:20}], (err, res) => {
    //     if(err) return console.log(err)
    //     console.log(res)
    // })

    db.collection('tasks').insertMany([{description:'Change car oil.', completed: true},{description:'Buy food.', completed: false}], (err, res) => {
        if(err) return console.log(err)
        console.log(res)
    })

})
