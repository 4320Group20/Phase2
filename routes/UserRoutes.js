const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserAccountsController');

router.post('/', userController.createUser);
router.get('/nonadmin', userController.getNonAdminUsers);

module.exports = router;