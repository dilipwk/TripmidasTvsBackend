const express = require('express');
const router = express.Router();
const requestBidController = require('../../app/api/controllers/admin/requestBid');

router.get('/', requestBidController.getAll);
router.post('/', requestBidController.create);
router.get('/:movieId', requestBidController.getById);

module.exports = router;