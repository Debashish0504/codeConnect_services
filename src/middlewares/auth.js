const jwt = require("jsonwebtoken")
const User = require("../models/user.js")

const authAdmin = (req,res,next) => {
    console.log("Admin auth inserted")
    const token = 'xyz'
    const isAdminAuthorized = token === 'xyz'
    if(!isAdminAuthorized){
        res.send("Admin not Authorized")
    }
    next()
}

const authUser = async(req,res,next) => {
   try{

  
        const {token} = req.cookies
        if(!token){
            return res.status(401).send("Please Login")
           // throw new Error("Invalid Token")
        }
        const validatedToken = await jwt.verify(token , "Dev@Tinder$")
        const {_id} = validatedToken

        const user = await User.findById(_id)
        if(!user){
            throw new Error("User doesnot exist")
        }
        req.user = user
    
        next()
    }catch(err){
        res.status(400).send("Error while login" +err.message)
    }
}

module.exports ={
    authUser,
    authAdmin
}
