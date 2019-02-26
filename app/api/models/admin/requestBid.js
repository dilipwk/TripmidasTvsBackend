const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const requestBidSchema = new Schema({
    travelDetails: {
        type: Array,
		trim: false,		
		required: true,
    },
    travellerDetails: {
		type: Object,
		trim: false,		
		required: false,
	}, 
    updatedOn: {
        type: Date,
        trim:  true,
    }
});

module.exports = mongoose.model('requestBid', requestBidSchema)