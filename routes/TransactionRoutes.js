const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/TransactionController');

router.post('/add', transactionController.addTransaction);
router.get('/all', transactionController.getAllTransactions);

module.exports = router;