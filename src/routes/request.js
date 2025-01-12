const express = require("express")
const {authUser   } = require("../middlewares/auth.js")
const ConnectionRequestModel = require("../models/connectionRequest.js")
const User = require("../models/user")

const requestRouter = express.Router()

requestRouter.post("/request/send/:status/:toUserId" ,authUser, async (req,res) => {
    
    try{
        
        const fromUserId = req.user._id
        const toUserId = req.params.toUserId
        const status = req.params.status

        const allowedStatus = ["interested" , "ignored"]
        if(!allowedStatus.includes(status)){
            return res.status(400).json({message : "Invalid Status"})
        }

        console.log(toUserId)
        const validateUser = await User.findById(toUserId)
        if(!validateUser){
            return res.status(400).json({message : "User not found"})
        }

        const validateConnectionRequest = await ConnectionRequestModel.findOne({
            $or : [
               { fromUserId , toUserId},
               { fromUserId : toUserId , toUserId : fromUserId},
            ],
        })

        if(validateConnectionRequest){
            return res.status(400).json({message : "Connection Already Exists"})
        }

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
        }
        )
        const data = await connectionRequest.save()

        res.json({
            message : `${req.user.firstName} is ${status} in ${validateUser.firstName}`,
            data
        })
           
        }catch(err){
            res.status(400).send("Error while sending request " +err.message)
        }
})

module.exports = requestRouter