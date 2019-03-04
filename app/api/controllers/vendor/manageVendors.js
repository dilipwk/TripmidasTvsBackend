
const manageVendorsModel = require('../../models/vendor/manageVendors' );					

module.exports = {
	getById: function(req, res, next) {
		manageVendorsModel.findById(req.params.vendorId, function(err, vendorInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Vendor found!!!", data:{vendorInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let vendorsList = [];

		manageVendorsModel.find({}, function(err, vendors){
			if (err){
				next(err);
			} else{
				for (let vendor of vendors) {
					vendorsList.push({vendorDetails:vendor});
				}
				res.json({status:"success", message: "Vendors list found!!!", data:{vendorsList}});
							
			}

		});
	},

	updateById: function(req, res, next) {
		manageVendorsModel.findByIdAndUpdate(req.params.vendorId,{vendorDetails:req.body.vendorDetails}, function(err, vendorInfo){

			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Vendor updated successfully!!!", data:vendorInfo});
			}
		});
	},

	deleteById: function(req, res, next) {
		manageVendorsModel.findByIdAndRemove(req.params.vendorId, function(err, vendorInfo){
			if(err)
				next(err);
			else {
				res.json({status:"success", message: "Vendor deleted successfully!!!", data:null});
			}
		});
	},

	create: function(req, res, next) {
		manageVendorsModel.create({ vendorDetails: req.body.vendorDetails, updatedOn:new Date() }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Vendor added successfully!!!", data: result});
				  
				});
	},

}					