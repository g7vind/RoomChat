const express = require('express');
const router = express.Router();
const { signIn, signUp, logout } = require('../controllers/auth.controller');

router.post('/register',signUp);
router.post('/login',signIn);
router.get('/logout',logout);

module.exports = router;