const express = require('express');
const router = express.Router();
const userController = require('../controllers/ManageUserAccountsController');

router.post('/register', userController.registerUser);
router.post('/authenticate', userController.authenticate)

module.exports = router;