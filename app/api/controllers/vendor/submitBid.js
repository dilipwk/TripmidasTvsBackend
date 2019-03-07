
const submitBid = require('../../models/vendor/submitBid');					
const requestBid = require('../../models/admin/requestBid');
const manageVendorsModel = require('../../models/vendor/manageVendors' );		
const nodemailer = require("nodemailer");
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'yourtrip@tripmidas.com', // generated ethereal user
      pass: 'Tr!p1M!D@s$m9410' // generated ethereal password
    }
  });
  let mailOptions = {
    from: 'yourtrip@tripmidas.com', // sender address
    subject: "Tripmidas - Congratulations!! Your bid is filtered to book ticket", // Subject line
     // html body
  };

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

	getByVendor: function(req,res,next){
		submitBid.find({adminRequestBidId:req.params.adminRequestBidId,vendorId:req.params.vendorId},function(err, bidData){
			if(err){
				next(err);
			} else {
				res.json({status:"success", message: "Data found!!!",isValid:true, data:{bidData}});
			}
		})
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
		submitBid.find({adminRequestBidId:req.body.adminRequestBidId,vendorId:req.body.vendorId},function(err, bidData){
			if(err){
				next(err);
			} else {
				if(bidData.length <= 0){
					submitBid.create({ adminRequestBidId: req.body.adminRequestBidId, vendorId: req.body.vendorId,travelDetails: req.body.travelDetails,updatedOn:new Date().toISOString()
					}, function (err, result) {
							  if (err) 
								  next(err);
							  else
								  res.json({status: "success", message: "Bid Submitted successfully", data: result});
							  
							});
				} else {
					res.json({status: "success", message: "Bid already submitted", data: {}});
				}
			}
		})
		
	},

	filterBids: function(req,res,next){
		var date = new Date();
		var myStartDate =new Date(date.getTime() - 60*60000).toISOString();
		date = new Date().toISOString();
		let bidData = [];
		let corporate = [];
		let retail = [];
		let travelData = [];
		requestBid.find({updatedOn:{$gte:myStartDate,$lt:date}}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
					submitBid.find({adminRequestBidId:bid._id}, function(err, bidInfo){
						if (err) {
							next(err);
						} else {
							for(let travelDetail of bidInfo){
								travelData.push(travelDetail);
								for(let inDetail of travelDetail.travelDetails){
									inDetail.vendorId = travelDetail.vendorId;
									inDetail.submittedBidId = travelDetail._id;
									inDetail.travellerDetails =  travelDetail.travellerDetails;
									inDetail.adminRequestBidId = travelDetail.adminRequestBidId;
									inDetail.totalSum = parseFloat(inDetail.totalFare) +  parseFloat(inDetail.cancellationFee);
									console.log(inDetail.totalSum);
									if(inDetail.type == 'Corporate')
										corporate.push(inDetail);
									else 
										retail.push(inDetail);
								}
							}
							if(corporate.length > 0){
								var result = Math.min.apply(Math,corporate.map(function(o){	
								return o.totalSum;}))
							
								let index = corporate.findIndex(x => x.totalSum==result)
								manageVendorsModel.findById(corporate[index].vendorId, function(err, vendorInfo){
									if (err) {
										next(err);
									} else {
										//email vendor
										mailOptions.to = vendorInfo.vendorDetails.vendorEmail;
										mailOptions.html = "<b>You are eligible to book ticket  <br> <br>Please Check the below link <br> https://tvs.tripmidas.in/tvs/uploadticket/"+corporate[index].submittedBidId+"/"+corporate[index].adminRequestBidId+"/"+ corporate[index].vendorId+"/"+index+"</b>"
										transporter.sendMail(mailOptions);
										
									}
									
									res.json({status:"success", message: "Filter", data:{}});
								});
							} else {
								var result = Math.min.apply(Math,retail.map(function(o){	
									return o.totalSum;}))
								
									let index = retail.findIndex(x => x.totalSum==result)
									manageVendorsModel.findById(corporate[index].vendorId, function(err, vendorInfo){
										if (err) {
											next(err);
										} else {
											//email vendor
											mailOptions.to = vendorInfo.vendorDetails.vendorEmail;
											mailOptions.html = "<b>You are eligible to book ticket  <br> <br>Please Check the below link <br> https://tvs.tripmidas.in/tvs/uploadticket/"+corporate[index].submittedBidId+"/"+corporate[index].adminRequestBidId+"/"+ corporate[index].vendorId+"/"+index+"</b>"
											transporter.sendMail(mailOptions);
											
										}
										
										res.json({status:"success", message: "Filter", data:{}});
									});
							}
						}
					});
				}			
			}
		});

	},


}					