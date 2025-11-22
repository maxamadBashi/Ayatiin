const express = require('express');
const router = express.Router();
const {
    getUnits,
    createUnit,
    updateUnit,
    deleteUnit,
} = require('../controllers/unitController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(protect, getUnits).post(protect, admin, createUnit);
router
    .route('/:id')
    .put(protect, admin, updateUnit)
    .delete(protect, admin, deleteUnit);

module.exports = router;
