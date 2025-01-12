const express = require("express")
const userRouter = express.Router()

const ConnectionRequestModel = require("../models/connectionRequest")
const {authUser } = require ("../middlewares/auth")

userRouter.get("/user/request/received" , authUser , async(req , res) =>{

    try{

        const logginUser = req.user

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : logginUser._id,
            status : "interested"
        }).populate("fromUserId" , ["firstName" , "emailId"])

        if(!connectionRequest){
            return res.status(400).send('No Connection Request')
        }

        res.json({
            message : 'Connection Fetch Successfully',
            data : connectionRequest
        })

    }catch(err){
        res.status(400).send("Error while request receive " + err.message )
    }
})

module.exports = userRouter