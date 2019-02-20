
const submitBid = require('../../models/vendor/submitBid');					
const requestBid = require('../../models/admin/requestBid');	

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		submitBid.findById(req.params.bidId, function(err, bidInfo){
			if (err) {
				next(err);
			} else {
               // var timeDiff = new Date() - new Date(bidInfo.updatedOn);
                //timeDiff =  Math.round(((timeDiff % 86400000) % 3600000) / 60000)
                //if(timeDiff < 30){
                    requestBid.findById(bidInfo.adminRequestBidId, function(err, requestBidInfo){
                        if (err) {
                            next(err);
                        } else {
                            let travellerDetails = requestBidInfo.travellerDetails;
                            res.json({status:"success", message: "Data found!!!",isValid:true, data:{bidInfo,travellerDetails}});
                        }
                    });
                //}
                //else{
                //    res.json({status:"success", message: "Timeout", isValid:false,data:{bidInfo: null}});
                //}
                
			}
		});
	},

	getAll: function(req, res, next) {
		let bidData = [];

		submitBid.find({}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
				}
				res.json({status:"success", message: "Bid Lists", data:{bidData}});
							
			}

		});
	},


	create: function(req, res, next) {
        console.log(JSON.stringify(req.body));
		submitBid.create({ adminRequestBidId: req.body.adminRequestBidId, vendorId: req.body.vendorId,travelDetails: req.body.travelDetails,updatedOn: new Date() }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Bid Submitted successfully", data: result});
				  
				});
	},

}					