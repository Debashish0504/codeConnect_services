const mongoose = require("mongoose")

const connectionRequestSchema = mongoose.Schema(
    {
        fromUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        toUserId : {
            type : mongoose.Schema.Types.ObjectId,
            required : true
        },
        status : {
            type : String,
            enum : {
                values : ["accepted" , "rejected" , "ignored" , "interested"],
                message: `{VALUE} is incorrect type`
            }
        }
    },{
        timestamps: true
    }
)

connectionRequestSchema.pre("save" , function (next) {
    const connectionRequest = this
     
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot Send Request to yourself")
    }

    next()
}) 

const ConnectionRequestModel = mongoose.model("ConnectionRequest" , connectionRequestSchema)

module.exports = ConnectionRequestModel