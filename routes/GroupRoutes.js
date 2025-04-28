const express = require('express');
const router = express.Router();
const groupController = require('../controllers/GroupController');

router.get('/all', groupController.getGroups);
router.post('/groups', groupController.createGroup);
router.put('/:id', groupController.updateGroup);

module.exports = router;