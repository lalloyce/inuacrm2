const express = require('express');
const loginRouter = require('./login');
const registerRouter = require('./register');
const passwordResetRouter = require('./password-reset');
const router = express.Router();

router.use('/login', loginRouter);
router.use('/register', registerRouter);
router.use('/password-reset', passwordResetRouter);

module.exports = router;
