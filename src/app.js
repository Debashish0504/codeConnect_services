const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const bcrypt = require("bcrypt")
const app = express()
const {validateSignUpData} = require("./utils/validation.js")

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

app.post("/login" , async(req,res) => {
    try{
        const {emailId , password} = req.body

        const user = await User.findOne({
            emailId : emailId
        })

        if(!user){
            throw new Error("Email ID doesnot exist")
        }

        const isPasswordValid = await bcrypt.compare(password , user.password)
        if(isPasswordValid){
            res.send("Login Successful")
        }else{
            throw new Error("Password doesnot exist")
        }

    }catch(err){
        res.status(400).send("Error while login" +err.message)
    }
})

app.post("/signUp" , async (req,res) => {
    try{
        validateSignUpData(req)
        const {firstName , lastName , emailId , password} = req.body
        const passwordHash = await bcrypt.hash(password,10)
        console.log(passwordHash)
        const user = new User ({
            firstName , lastName , emailId , password : passwordHash
        })
       
            await user.save()
            res.send("User Added Successfully")
        }catch(err){
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

app.delete("/user"  , async (req,res) => {
    const id = req.body.userId 
    try{
        const user = await User.findByIdAndDelete(id)
        if(!user){
            res.status(404).send("User not found")
        }
        res.send("User deleted Successfully")
    }catch{
        res.status(404).send("Something Went Wrong")
    }
})

app.patch("/user/:userId" , async (req , res) => {
    const id = req.params?.userId
    const data = req.body
    try{
        const ALLOWED_UPDATES = ['password' , 'age' , 'gender']
        const isUpdateAllowed = Object.keys(data).every((k) => 
        ALLOWED_UPDATES.includes(k))
        if(!isUpdateAllowed){
            throw new Error('Update not allowed')
        }
        const user = await User.findByIdAndUpdate(id , data , {
            runValidators : true
        })
        res.send("User updated Successfully")
    }catch (err){
        res.status(404).send("Update failed" + err.message)
    }
})


connectDB().then(() => {
    console.log("Database connected Successfully")
    app.listen(8000 , () => console.log('Welcome to 8000'))
}).catch(() => {
    console.log("Database connection Error")
})

