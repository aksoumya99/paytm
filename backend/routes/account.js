const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware');
const { Account } = require('../db');
const mongoose = require('mongoose');

router.get('/balance', authMiddleware, async (req, res) => {
    const userId = req.userId;
    const account = await Account.findOne({
        userId: userId
    });
    if(!account) {
        console.log(userId);
        return res.status(500).json({
            message: "Account does not exist"
        })
    }
    res.json({
        balance: account.balance
    });
});

router.post('/transfer', authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { to, amount } = req.body;

    const account = await Account.findOne({userId: req.userId}).session(session);

    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient Balance"
        });
    }

    const toAccount = await Account.findOne({ userId: to }).session(session);

    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }

    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount }}).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount }}).session(session);

    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    })
});



module.exports = {
    accountRouter: router
};