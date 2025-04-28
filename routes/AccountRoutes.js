const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/AccountsController');

router.get('/masteraccounts', accountsController.getAllMasterAccounts);
router.post('/masteraccounts', accountsController.createMasterAccount);
router.put('/masteraccounts/:id', accountsController.updateMasterAccount);
router.delete('/masteraccounts/:id', accountsController.deleteMasterAccount);

module.exports = router;