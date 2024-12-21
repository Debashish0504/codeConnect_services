const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName : {
        type : String
    },
    lasttName : {
        type : String
    },
    emailId : {
        type : String
    },
    password : {
        type : String
    },
    age :{
        type : Number
    },
    gender : {
        type : String
    },
})

const User = mongoose.model("User" , userSchema)

module.exports = User