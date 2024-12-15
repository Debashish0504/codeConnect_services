const express = require("express")

const app = express()


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

app.use( (req,res) =>{
    res.send("Hello Dashboard")
})



app.listen(8000 , () => console.log('Welcome to 8000'))