const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User } = require("../db");

const signupBody = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("signup", async (req, res) => {
    const { success } = signupBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect input"
        });
    }

    const existingUser = await User.findOne({
        username: req.body.username
    });

    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/ Incorrect input"
        });
    }

    const user = await User.create({
        username: req.body.username,
        password: req.body.username,
        firstName: req.body.firstName,
        lastName: req.bosy.lastName,
    });

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });

})

module.exports = {
    userRouter
}