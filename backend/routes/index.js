const express = require('express');
const router = express.Router(); 
const { userRouter } = require('./user');
const { accountRouter } = require('./account');

router.use("/account", accountRouter);
router.use("/user", userRouter);

module.exports = {
    rootRouter: router
}