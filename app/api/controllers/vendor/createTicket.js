
const CreateTicketModel = require('../../models/vendor/createTicket' );		


module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		CreateTicketModel.findById(req.params.vendorId, function(err, vendorInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Vendor found!!!", data:{vendorInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let vendorsList = [];

		CreateTicketModel.find({}, function(err, vendors){
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
    
    upload: function(req, res, next) {
        console.log(req);
        res.json({'message': req.file});
	},

	create: function(req, res, next) {
		CreateTicketModel.create({ adminRequestBidId: req.body.adminRequestBidId, vendorId: req.body.vendorId,vendorBidId: req.body.vendorBidId,travelDetails: req.body.travelDetails,travellerDetails: req.body.travellerDetails,ticket: req.body.ticket, updatedOn:new Date() }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Ticket created successfully!!!", data: result});
				  
				});
	},

}					