const validator = require("validator")
const bcrypt = require("bcrypt")

const validateSignUpData = (req) =>{

    const {firstName , lasttName , emailId , password , age , gender} = req.body

    if( !firstName || !lasttName ){
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Password is not valid")
    }

}

const validateEditProfileData = (req) => {
    const allowedEditFields = [ "firstName" , "lasttName" , "age" , "gender" ]
    console.log(req.body)
    const isEditAllowed = Object.keys(req.body).every((field) => allowedEditFields.includes(field))
    console.log(isEditAllowed)
    return isEditAllowed
}

const validUpdatePassword = (req) => {
    const allowedUpdateFields = ["password" , "confirmPassword"]
    console.log(req.body)
    const isUpdateAllowed = Object.keys(req.body).every((field) => allowedUpdateFields.includes(field))

    return isUpdateAllowed
}

const validCurrentPassword = async (req , user) => {

    const {password , confirmPassword} = req.body
    console.log(password)

    const isOldPasswordValid = await bcrypt.compare(password , user.password)
    console.log(isOldPasswordValid)

    return isOldPasswordValid
}

const validNewPassword = async(req,user) => {
    const {password , confirmPassword} = req.body
    console.log(password)

    const isNewPasswordValid = await bcrypt.compare(confirmPassword , user.password)
    console.log(isNewPasswordValid)

    return isNewPasswordValid
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validUpdatePassword,
    validCurrentPassword,
    validNewPassword
}