const express = require("express")
const connectDB = require("./config/database.js")
const app = express()
const cookieParser = require("cookie-parser")
const cors = require("cors")
require("dotenv").config();
app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))
app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js")
const userRouter = require("./routes/user.js")
const paymentRouter = require("./routes/payment.js")

app.use("/" , authRouter)
app.use("/" , profileRouter)
app.use("/" , requestRouter)
app.use("/" , userRouter)
app.use("/" , paymentRouter)



connectDB().then(() => {
    console.log("Database connected Successfully")
    app.listen(process.env.PORT , () => console.log('Welcome to 8000'))
}).catch(() => {
    console.log("Database connection Error")
})

