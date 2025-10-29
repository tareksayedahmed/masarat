const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Define routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', auth, getMe);

module.exports = router;
