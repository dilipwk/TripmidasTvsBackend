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
        type: String,
        trim:  true,
        required: true,
    },
    flightIds: {
        type: Array,
        required:true
    }
});

module.exports = mongoose.model('requestBid', requestBidSchema)