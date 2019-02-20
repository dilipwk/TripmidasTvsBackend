const express = require('express');
const router = express.Router();
const manageVendorsController = require('../../app/api/controllers/vendor/manageVendors');

router.get('/', manageVendorsController.getAll);
router.post('/', manageVendorsController.create);
router.get('/:vendorId', manageVendorsController.getById);
router.put('/:vendorId', manageVendorsController.updateById);
router.delete('/:vendorId', manageVendorsController.deleteById);

module.exports = router;