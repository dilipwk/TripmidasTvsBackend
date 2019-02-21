const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const createTicketSchema = new Schema({
    adminRequestBidId: {
        type: String,
        trim: true,
        required: true
    },
    vendorId: {
		type: String,
		trim: false,
		required: true
	},
    vendorBidId: {
        type: String,
        trim: true,
        required: true
    },
	travelDetails: {
		type: Array,
		trim: false,		
		required: true,
    },
    travellerDetails: {
		type: Array,
		trim: false,		
		required: true,
    },
    ticketPath:{
        type:String,
        required:true
    },
    updatedOn: {
        type: Date,
        trim:  true,
    }
});

module.exports = mongoose.model('createTicket', createTicketSchema)