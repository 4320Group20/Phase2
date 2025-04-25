const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');

router.get('/', groupController.getTreeViewData);
router.post('/add', groupController.addGroup);
router.post('/edit', groupController.editGroup);

module.exports = router;