const express = require('express');
const router = express.Router();
const accountsController = require('../controllers/AccountsController');

router.get('/MasterAccounts', accountsController.getAllMasterAccounts);
router.post('/AddMasterAccount', accountsController.addMasterAccount);
router.post('/EditMasterAccount', accountsController.editMasterAccount);
router.post('/DeleteMasterAccount', accountsController.deleteMasterAccount);

module.exports = router;