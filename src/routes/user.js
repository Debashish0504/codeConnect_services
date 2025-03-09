const express = require("express")
const userRouter = express.Router()

const ConnectionRequestModel = require("../models/connectionRequest")
const User = require("../models/user")
const {authUser } = require ("../middlewares/auth")

const USER_SAFE_DATA = ["firstName" ,"lasttName", "emailId"]

userRouter.get("/user/request/received" , authUser , async(req , res) =>{

    try{

        const logginUser = req.user

        const connectionRequest = await ConnectionRequestModel.find({
            toUserId : logginUser._id,
            status : "interested"
        }).populate("fromUserId" , USER_SAFE_DATA)

        if(!connectionRequest){
            return res.status(400).send('No Connection Request')
        }
        console.log(connectionRequest)
        res.json({
            message : 'Connection Fetch Successfully',
            data : connectionRequest
        })

    }catch(err){
        res.status(400).send("Error while request receive " + err.message )
    }
})


userRouter.get("/user/connections" , authUser , async (req,res) => {
    try{
        const logginUser = req.user

        const connectionRequest = await ConnectionRequestModel.find({
            $or:[
                {toUserId : logginUser._id , status : "accepted"},
                {fromUserId : logginUser._id , status : "accepted"},
            ]
        }).populate("fromUserId" , USER_SAFE_DATA)
          .populate("toUserId" , USER_SAFE_DATA)

        const data = connectionRequest.map((row) => {
            if(row.fromUserId._id.toString() === logginUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({message: `Connection Fetch Successfully` ,
        data : data
    })

    }catch(err){
        res.status(400).send("Error while request receive " + err.message )
    }
})

userRouter.get("/feed" , authUser , async (req,res) => {
    try{

        const logginUser = req.user
        const pages = parseInt(req.query.pages) || 1
        let limit = parseInt(req.query.limit) || 10
        //limit = limit > 50 ? 50 : 10
        const skip = (pages - 1) * limit

        const connectionRequest = await ConnectionRequestModel.find({
            $or : [
                {fromUserId : logginUser._id},
                {toUserId : logginUser._id}
            ]
        })

        const hideUserInFeed = new Set()

        connectionRequest.forEach((req) => {
            hideUserInFeed.add(req.fromUserId.toString())
            hideUserInFeed.add(req.toUserId.toString())
        });

        const users = await User.find({
            $and: [
                {_id : {$nin : Array.from(hideUserInFeed)}},
                {_id : {$ne : logginUser._id}}
            ]
        })
        .select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit)

        res.send(users)


    }catch(err){
        res.status(400).send("Error in feed" +err.message)
    }
})

module.exports = userRouter