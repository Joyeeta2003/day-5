const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const userAlreadyExsist = await userModel.findOne({ email })

    if (userAlreadyExsist) {
        return res.status(400).json({
            message: "user already exsist with this email address"
        })
    }
    const user = await userModel.create({
        name, email, password
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token",token)

    res.status(201).json({
        message: "user registered successfully",
        user,
        token
    })
})

module.exports = authRouter