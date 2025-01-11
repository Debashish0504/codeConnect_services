const express = require("express")
const {authUser   } = require("../middlewares/auth.js")
const {validateEditProfileData} = require("../utils/validation.js")

const profileRouter = express.Router()

profileRouter.get("/profile/view" ,authUser, async (req,res) => {
    
    try{
    
            const user = req.user
            
            res.send(user)
        }catch(err){
            res.status(400).send("Error while login" +err.message)
        }
})

profileRouter.patch("/profile/edit" , authUser , async (req,res) => {
    try{
        console.log(req.body)

        if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit request")
        }

        const logginUser = req.user
        Object.keys(req.body).forEach((key) => (logginUser[key] = req.body[key]))

        await logginUser.save()

        res.json({message : `${logginUser.firstName} , your profile updated successfully` , data : logginUser })

    }catch(err){
        res.status(400).send("Error while edit" +err.message)
    }
})

module.exports = profileRouter