const express = require('express');
const router = express.Router();
const createTicketController = require('../../app/api/controllers/vendor/createTicket');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/tickets/' })

router.get('/', createTicketController.getAll);
router.post('/', createTicketController.create);
router.post('/uploadTicket', upload.single('ticket'), createTicketController.upload);
router.get('/:bidId', createTicketController.getById);

module.exports = router;