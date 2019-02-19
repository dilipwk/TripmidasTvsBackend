const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const requestBidSchema = new Schema({
	source: {
		type: String,
		trim: false,		
		required: true,
	},
	destination: {
		type: String,
		trim: false,
		required: true
	},
    date: {
        type: Date,
        trim:  true,
        required: true,
	},
	PreferredTime: {
        type: Object,
        trim:  true,
        required: false,
    },
    flightIds: {
        type: Array,
        required:true
    },
    updatedOn: {
        type: Date,
        trim:  true,
    }
});

module.exports = mongoose.model('requestBid', requestBidSchema)