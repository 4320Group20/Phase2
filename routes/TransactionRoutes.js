const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

router.post('/add', transactionController.addTransaction);
router.post('/edit', transactionController.addTransaction);
router.post('/delete', transactionController.addTransaction);

module.exports = router;