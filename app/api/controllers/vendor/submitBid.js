
const submitBid = require('../../models/vendor/submitBid');					
const requestBid = require('../../models/admin/requestBid');	

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		submitBid.findById(req.params.bidId, function(err, bidInfo){
			console.log("bid info: "+bidInfo);
			 if (err) {
				next(err);
			} else {
               var timeDiff = new Date() - new Date(bidInfo.updatedOn);
                timeDiff =  Math.round(((timeDiff % 86400000) % 3600000) / 60000)
                if(timeDiff < 30){
                    requestBid.findById(bidInfo.adminRequestBidId, function(err, requestBidInfo){
                        if (err) {
                            next(err);
                        } else {
                            let travellerDetails = requestBidInfo.travellerDetails;
                            res.json({status:"success", message: "Data found!!!",isValid:true, data:{bidInfo,travellerDetails}});
                        }
                    });
                }
                else{
                   res.json({status:"success", message: "Timeout", isValid:false,data:{bidInfo: null}});
                }
                
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
		submitBid.create({ adminRequestBidId: req.body.adminRequestBidId, vendorId: req.body.vendorId,travelDetails: req.body.travelDetails,updatedOn:new Date().toISOString()
		}, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Bid Submitted successfully", data: result});
				  
				});
	},

	filterBids: function(req,res,next){
		var date = new Date();
		var myStartDate =new Date(date.getTime() - 30*60000).toISOString();
		date = new Date().toISOString();
	//	res.json({status:"success", message: "Data found!!!",isValid:true, data:{current:date,update:myStartDate}});
	console.log(myStartDate);
	console.log(date);
	let bidData = [];
		requestBid.find({updatedOn:{$gte:myStartDate,$lt:date}}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
					console.log("admin bid id:"+bid._id)
					submitBid.findById({adminRequestBidId:bid._id}, function(err, bidInfo){
						if (err) {
							next(err);
						} else {
							//for(let travelDetail of bidInfo)
							console.log(bidInfo);
						}
					});
				}
				res.json({status:"success", message: "Bid List", data:{bidData,curr:date,update:myStartDate}});
							
			}

		});

	},


}					