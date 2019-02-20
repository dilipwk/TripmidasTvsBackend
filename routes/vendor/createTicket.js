const express = require('express');
const router = express.Router();
const createTicketController = require('../../app/api/controllers/vendor/createTicket');

router.get('/', createTicketController.getAll);
router.post('/', createTicketController.create);
router.get('/:bidId', createTicketController.getById);

module.exports = router;