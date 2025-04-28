const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');

router.post('/report', reportController.generate);

module.exports = router;