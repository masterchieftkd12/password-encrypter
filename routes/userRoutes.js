const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/register', userController.showRegister);
router.post('/register', userController.register);
router.get('/login', userController.showLogin);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

module.exports = router;
