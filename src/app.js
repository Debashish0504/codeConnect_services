const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()

const {authUser , authAdmin  } = require("./middlewares/auth.js")

app.use(express.json())

app.use("/admin/getAllData" , authAdmin , (req,res) => {
    res.send('Admin Data')
})

app.use("/user/login" ,  (req,res) => {
    res.send('User LoggedIn Successfully')
})

app.use("/user/getAllData" , authUser , (req,res) => {
    res.send('User Data')
})



app.post("/signUp" , async (req,res) => {
    const user = new User (req.body)

        try{
            await user.save()
            res.send("User Added Successfully")
        }catch{
            res.status(400).send("Error while signUp" +err.message)
        }
})

app.get("/user" , async (req,res) => {
    const email = req.body.emailId
    const user = await User.findOne({emailId : email})
    if(!user){
        res.status(404).send("User not found")
    }else{
        res.send(user)
    }

})

app.get("/feed" , async (req,res) => {
    const email = req.body.emailId
    const user = await User.find()
    if(user.length === 0){
        res.status(404).send("User not found")
    }else{
        res.send(user)
    }

})


connectDB().then(() => {
    console.log("Database connected Successfully")
    app.listen(8000 , () => console.log('Welcome to 8000'))
}).catch(() => {
    console.log("Database connection Error")
})

