const express = require("express")
const {authUser   } = require("../middlewares/auth.js")

const requestRouter = express.Router()

requestRouter.post("/sendConnectionRequest" ,authUser, async (req,res) => {
    
    try{
    
            const user = req.user
            
            res.send(user.firstName + " sent request")
        }catch(err){
            res.status(400).send("Error while login" +err.message)
        }
})

module.exports = requestRouter