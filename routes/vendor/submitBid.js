const express = require('express');
const router = express.Router();
const submitBidController = require('../../app/api/controllers/vendor/submitBid');

router.get('/', submitBidController.getAll);
router.get('/filterBids',submitBidController.filterBids);
router.post('/', submitBidController.create);
router.get('/:bidId', submitBidController.getById);


module.exports = router;