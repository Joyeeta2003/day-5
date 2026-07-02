const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(res =>{
        console.log(("database is connected"));
    })
}

module.exports = connectToDb;