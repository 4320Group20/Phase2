const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController');

router.get('/all', userController.getAllUsers);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.post('/reset-password', userController.resetPassword);

module.exports = router;