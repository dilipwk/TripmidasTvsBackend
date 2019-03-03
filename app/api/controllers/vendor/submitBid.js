
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
            //    var timeDiff = new Date() - new Date(bidInfo.updatedOn);
            //     timeDiff =  Math.round(((timeDiff % 86400000) % 3600000) / 60000)
            //     if(timeDiff < 30){
                    requestBid.findById(bidInfo.adminRequestBidId, function(err, requestBidInfo){
                        if (err) {
                            next(err);
                        } else {
                            let travellerDetails = requestBidInfo.travellerDetails;
                            res.json({status:"success", message: "Data found!!!",isValid:true, data:{bidInfo,travellerDetails}});
                        }
                    });
            //    }
            //     else{
            //        res.json({status:"success", message: "Timeout", isValid:false,data:{bidInfo: null}});
            //     }
                
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
		var myStartDate =new Date(date.getTime() - 60*60000).toISOString();
		date = new Date().toISOString();
	//	res.json({status:"success", message: "Data found!!!",isValid:true, data:{current:date,update:myStartDate}});
	console.log(myStartDate);
	console.log(date);
	let bidData = [];
	let travelFilter = [];
	let corporate = [];
	corporate.data = {};
	let retail = [];
		requestBid.find({updatedOn:{$gte:myStartDate,$lt:date}}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
					console.log("admin bid id:"+bid._id)
					submitBid.find({adminRequestBidId:bid._id}, function(err, bidInfo){
						if (err) {
							next(err);
						} else {
							for(let travelDetail of bidInfo){
								travelFilter.push(travelDetail);
								corporate.push({data:travelDetail.travelDetails,vendorId:travelDetail.vendorId});
								// for(let inDetail of travelDetail.travelDetails){
								// 	travelFilter.push(inDetail);									
								// }
								// travelDetail.travelDetails.forEach((item) => {
								// 	if(item.type === 'Corporate'){
								// 		corporate.push(item)
								// 	} else {
								// 		retail.push(item);
								// 	}
								// });
							}
							
							// if(corporate.length > 0){
							// 	var res = Math.max.apply(Math,corporate.map(function(o){return parseInt(o.totalFare);}))
							// 	console.log(res);
							// }
							
							res.json({status:"success", message: "Bid List", data:{corporate:corporate,retail:retail,travelFilter,curr:date,update:myStartDate}});
						}
					});
				}
				
							
			}

		});

	},


}					