const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 3

    },
    lasttName : {
        type : String
    },
    emailId : {
        type : String,
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String
    },
    age :{
        type : Number

    },
    gender : {
        type : String,
        validate(value){
            if(!['male','female','others'] .includes(value)){
                throw new Error('Gender not valid')
            }
        }

    },
},{
    timestamps : true
}
)

const User = mongoose.model("User" , userSchema)

module.exports = User