const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

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
        trim : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email not valid')
            }
        }
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

userSchema.methods.getJWT = async function (){
    const user = this

    const token = await jwt.sign({_id : user._id} , "Dev@Tinder$" )

    return token
}

userSchema.methods.validatePassword = async function (userPassword){
    const user = this


    const isPasswordValid  = await bcrypt.compare(userPassword , user.password)

    return isPasswordValid
}

const User = mongoose.model("User" , userSchema)



module.exports = User