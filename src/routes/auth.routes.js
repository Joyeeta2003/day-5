const express = require("express")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")

const authRouter = express.Router()

authRouter.post("/register", async (req, res) => {
    const { name, email, password } = req.body

    const userAlreadyExsist = await userModel.findOne({ email })

    if (userAlreadyExsist) {
        return res.status(400).json({
            message: "user already exsist with this email address"
        })
    }

    const hash = crypto.createHash("md5").update(password).digest("hex")

    const user = await userModel.create({
        name, email, password:hash
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    },
        process.env.JWT_SECRET
    )

    res.cookie("jwt_token", token)

    res.status(201).json({
        message: "user registered successfully",
        user,
        token
    })
})

authRouter.get("/get-me",async (req,res)=>{
    const token = req.cookies.jwt_token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.id)

    res.json({
        name:user.name,
        email:user.email
    })

})
authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })

    if (!user) {
        return res.status(404).json({
            message: "user not found with this email address"
        })
    }

    const isPasswordMatched = user.password === crypto.createHash("md5").update(password).digest("hex")
    if (!isPasswordMatched) {
        return res.status(401).json({
            message: "invalid password"
        })
    }

    const token = jwt.sign({
        id: user._id,
    },process.env.JWT_SECRET)

    res.cookie("jwt_token", token)

    res.status(200).json({
        message: "user logged in",
        user
    })
})

module.exports = authRouter