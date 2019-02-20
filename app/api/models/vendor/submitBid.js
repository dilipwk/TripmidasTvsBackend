const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const submitBidSchema = new Schema({
    adminRequestBidId: {
        type: String,
        trim: true,
        required: true
    },
	travelDetails: {
		type: Array,
		trim: false,		
		required: true,
	},
	vendorId: {
		type: String,
		trim: false,
		required: true
	},
    updatedOn: {
        type: Date,
        trim:  true,
    }
});

module.exports = mongoose.model('submitBid', submitBidSchema)