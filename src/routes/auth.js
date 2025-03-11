const express = require("express")
const {validateSignUpData} = require("../utils/validation.js")
const User = require("../models/user.js")
const bcrypt = require("bcrypt")

const authRouter = express.Router()

authRouter.post("/login" , async(req,res) => {
    try{
        const {emailId , password} = req.body

        const user = await User.findOne({
            emailId : emailId
        })

        if(!user){
            throw new Error("Email ID doesnot exist")
        }

        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){
            const token = await user.getJWT()
            console.log(token)
            res.cookie("token" , token )
            res.send(user)
        }else{
            throw new Error("Password doesnot exist")
        }

    }catch(err){
        res.status(400).send("Error while login" +err.message)
    }
})

authRouter.post("/signUp" , async (req,res) => {
    try{
        validateSignUpData(req)
        const {firstName , lastName , emailId , password , age , gender} = req.body
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)
        const user = new User ({
            firstName , lastName , emailId , password : passwordHash , age , gender
        })
        const savedUser = await user.save();
        const token = await savedUser.getJWT();
    
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000),
        });
    
        res.json({ message: "User Added successfully!", data: savedUser });
        }catch(err){
            res.status(400).send("Error while signUp" +err.message)
        }
})

authRouter.post("/logout" , async(req,res) => {
    res.cookie("token" , null , {
        expires : new Date(Date.now())
    }).send("Logout Successfully")
})

module.exports = authRouter
