const express = require("express")

const app = express()

app.use("/test" , (req,res) =>{
    res.send("Hello test Again")
}) 

app.use("/hello" , (req,res) =>{
    res.send("Hello Again")
}) 

app.use( (req,res) =>{
    res.send("Hello Dashboard")
})



app.listen(8000 , () => console.log('Welcome to 8000'))