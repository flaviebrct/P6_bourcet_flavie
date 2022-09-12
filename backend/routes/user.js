const express = require('express');
const router = express.Router();
const password = require('../middleware/password');
const email = require('../middleware/email');
const limiter = require('../middleware/rateLimit');

const userCtrl = require('../controllers/user');

router.post('/signup', email, password, userCtrl.signup);
router.post('/login', limiter, userCtrl.login);

module.exports = router;