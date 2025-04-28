const express = require('express');
const router = express.Router();
const catergoryController = require('../controllers/CategoryController');

router.get('/all', catergoryController.getAllCategories);
router.post('/create', catergoryController.createCategory);
router.put('/:id', catergoryController.updateCategory);
router.delete('/:id', catergoryController.deleteCategory);

module.exports = router;