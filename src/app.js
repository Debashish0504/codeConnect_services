const express = require("express")
const connectDB = require("./config/database.js")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js")
const userRouter = require("./routes/user.js")

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)



connectDB().then(() => {
    console.log("Database connected Successfully")
    app.listen(8000 , () => console.log('Welcome to 8000'))
}).catch(() => {
    console.log("Database connection Error")
})

