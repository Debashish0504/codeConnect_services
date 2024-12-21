const express = require("express")
const connectDB = require("./config/database.js")
const User = require("./models/user.js")
const app = express()

const {authUser , authAdmin  } = require("./middlewares/auth.js")

app.use("/admin/getAllData" , authAdmin , (req,res) => {
    res.send('Admin Data')
})

app.use("/user/login" ,  (req,res) => {
    res.send('User LoggedIn Successfully')
})

app.use("/user/getAllData" , authUser , (req,res) => {
    res.send('User Data')
})



app.use("/user" , (req, res,next) => {
    console.log('Handle 1st route')
    //res.send("Handle 1st route")
    next()
    console.log('Handle 1st route again')
},(req, res,next) => {
    console.log('Handle 2nd route')
    //res.send("Handle 2nd route")
    next()
    console.log('Handle 2nd route again')
},(req, res,next) => {
    console.log('Handle 3rd route')
    res.send("Handle 3rd route")
    //next()
},
)


app.get("/user" , (req,res) =>{
    res.send({ "firstName" : "Debashish" , "lastName" : "Panigrahi"})
}) 

app.post("/user" , (req,res) =>{
    res.send("Data Added Successfully")
}) 

app.delete("/user" , (req,res) =>{
    res.send("User Deleted Successfully")
}) 

app.use("/test" , (req,res) =>{
    res.send("Hello test Again")
}) 

app.use("/hello" , (req,res) =>{
    res.send("Hello Again")
}) 

// app.use( (req,res) =>{
//     res.send("Hello Dashboard")
// })

app.post("/signUp" , async (req,res) => {
    const user = new User ({
        firstName: "MS" ,
        lastName: "DHoni" ,
        emailId: "msDhoni@gmail.com",
        password: "msd@123"
        })

        try{
            await user.save()
            res.send("User Added Successfully")
        }catch{
            res.status(400).send("Error while signUp" +err.message)
        }
})


connectDB().then(() => {
    console.log("Database connected Successfully")
    app.listen(8000 , () => console.log('Welcome to 8000'))
}).catch(() => {
    console.log("Database connection Error")
})

