try {

    const mongoose = require('mongoose')
    const dotenv = require('dotenv')

    dotenv.config()
    mongoose.connect(process.env.DB_PATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(result => {
        console.log("connected to database")
    }).catch(err => {
        console.log("error in database", err)
    })

    const db = mongoose.connection
        db.on('error', () => {
            console.log('error occured from the database')
        })
    db.once('open', () => {
        console.log('successfully opened the database')
    })

    module.exports = mongoose
}
catch (err) {
    console.log(err)
}


