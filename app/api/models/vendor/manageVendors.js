const mongoose = require('mongoose');

//Define a schema
const Schema = mongoose.Schema;

const manageVendorSchema = new Schema({
    vendorDetails: {
        type: Object,
        trim: true,
        required: true
    },
    updatedOn: {
        type: Date,
        trim:  true,
    }
});

module.exports = mongoose.model('manageVendor', manageVendorSchema)