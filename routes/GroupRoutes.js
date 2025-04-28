const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');

router.get('/all', groupController.getGroups);
router.post('/create', groupController.createGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

module.exports = router;