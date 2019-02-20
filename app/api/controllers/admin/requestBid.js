
const requestBid = require('../../models/admin/requestBid');					

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		requestBid.findById(req.params.bidId, function(err, bidInfo){
			if (err) {
				next(err);
			} else {
                var timeDiff = new Date() - new Date(bidInfo.updatedOn);
                timeDiff =  Math.round(((timeDiff % 86400000) % 3600000) / 60000)
                if(timeDiff < 20){
                    res.json({status:"success", message: "Data found!!!",isValid:true, data:{bidInfo: bidInfo}});
                }
                else{
                    res.json({status:"success", message: "Timeout", isValid:false,data:{bidInfo: bidInfo}});
                }
                
			}
		});
	},

	getAll: function(req, res, next) {
		let bidData = [];

		requestBid.find({}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
				}
				res.json({status:"success", message: "Bid List", data:{bidData}});
							
			}

		});
	},


	create: function(req, res, next) {
        console.log(JSON.stringify(req.body));
		requestBid.create({ travelId: req.body.travelId, travelDetails: req.body.travelDetails,travellerDetails:req.body.travellerDetails,updatedOn: new Date() }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Requested for bid successfully", data: result});
				  
				});
	},

}					