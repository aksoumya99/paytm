const express = require('express');
const router = express.Router();
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { User, Account } = require("../db");
const { authMiddleware } = require("../middleware");

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string()
});

router.post("/signup", async (req, res) => {
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
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const userId = user._id;

    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });

});

const loginBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/login", async (req, res) => {
    const { success } = loginBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect input"
        });
    }

    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });

    if (!user) {
        return res.status(411).json({
            message: "Invalid credentials"
        });
    }

    const userId = user._id;

    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    res.json({
        message: "Login successful",
        token: token
    });
});

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect Input"
        });
    }

    await User.updateOne(req.body, {
        _id: req.userId
    });

    res.json({
        message: "Updated successfully"
    });
});

router.get('/bulk', authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";

    const regex = new RegExp(filter, 'i');

    const users = await User.find({
        $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } }
        ]
    });


    res.json({
        users: users.map((user) => {
            return {
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }
        })
    })
});

module.exports = {
    userRouter: router
}