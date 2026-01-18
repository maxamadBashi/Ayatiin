const express = require('express');
const router = express.Router();
const {
    getGuarantors,
    getGuarantor,
    createGuarantor,
    updateGuarantor,
    deleteGuarantor
} = require('../controllers/guarantorController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/uploadMiddleware');

const uploadFields = upload.fields([
    { name: 'idPhoto', maxCount: 1 },
    { name: 'workIdPhoto', maxCount: 1 }
]);

router.route('/')
    .get(protect, getGuarantors)
    .post(protect, authorize('admin', 'manager', 'superadmin'), uploadFields, createGuarantor);

router.route('/:id')
    .get(protect, getGuarantor)
    .put(protect, authorize('admin', 'manager', 'superadmin'), uploadFields, updateGuarantor)
    .delete(protect, authorize('admin', 'superadmin'), deleteGuarantor);

module.exports = router;
