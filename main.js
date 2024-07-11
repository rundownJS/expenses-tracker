const express = require("express")
require("dotenv").config()
const app = express()
const antiXSS = require("./middleware/anti-xss")
const connectDB = require("./db/connect")
const notFoundMiddleware = require("./middleware/not-found")
const authMiddleware = require("./middleware/jwt-auth")
const errorHandlerMiddleware = require("./middleware/error-handler")
require("express-async-errors")
const helmet = require("helmet")
const XSS = require("xss-clean")
const cors = require("cors")
const path = require("path")
const rateLimit = require("express-rate-limit")

const PORT = process.env.PORT || 5001

const authRouter = require("./router/auth")
const expensesRouter = require("./router/expenses")


//security
app.use(helmet())
app.use(XSS())
app.use(cors())

app.use(antiXSS)
app.use(express.json())
app.set("trust proxy", 1)

//request limiter
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 minutes
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>{
        res.status(429).json({ 
            message: "Too many requests, please try again later." 
        })
    }
})

//register/login route
app.use("/expenses-tracker/api/v1/authUser", limiter, authRouter)

//expenses route => create/update/delete/get
app.use("/expenses-tracker/api/v1/expenses", limiter, authMiddleware, expensesRouter)

//serve client files
app.use(express.static(path.join(__dirname, "public")))


//rigster and login user routes
app.get("/register", (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "register", "register.html"))
})
app.get("/login", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "login", "login.html"))
})


//user dashboard view
app.get("/dashboard", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "dashboard", "dashboard.html"))
})

//not found route as well as the error handler
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, ()=>{
            console.log(`Server started on port ${PORT}...`)
        })
    }catch(err){
        console.log(err)
    }
    
}
start()