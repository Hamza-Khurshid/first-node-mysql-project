const router = require('express').Router();
const userController = require('../controllers/userController');

// Register a new User
router.post('/register', userController.register);

// Login
router.post('/login', userController.login);

// Reset password
router.post('/resetPassword', userController.resetPassword);

module.exports = router;