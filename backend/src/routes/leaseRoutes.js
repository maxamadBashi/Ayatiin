const express = require('express');
const router = express.Router();
const {
    getLeases,
    createLease,
    updateLease,
    deleteLease,
} = require('../controllers/leaseController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getLeases).post(protect, createLease);
router
    .route('/:id')
    .put(protect, updateLease)
    .delete(protect, deleteLease);

module.exports = router;
