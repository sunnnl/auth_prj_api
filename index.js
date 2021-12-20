const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
require("dotenv").config()


const userRouter = require("./api/user/user_route")
app.use(express.json())
app.use("/api/user", userRouter)

app.listen(process.env.APP_PORT, () => {
    console.log('PORT_CHECK')
})