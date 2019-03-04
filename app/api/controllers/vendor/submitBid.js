
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
    subject: "Tripmidas - Congratulations!! You bid is filtered to book ticket", // Subject line
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
		let bidData = [];
		let corporate = [];
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
								for(let inDetail of travelDetail.travelDetails){
									inDetail.vendorId = travelDetail.vendorId;
									inDetail.travellerDetails =  travelDetail.travellerDetails;
									inDetail.adminRequestBidId = travelDetail.adminRequestBidId;
									corporate.push(inDetail);
								}
							}
							var result = Math.min.apply(Math,corporate.map(function(o){
								return o.totalFare;}))
								let index = corporate.findIndex(x => x.totalFare==result)
								manageVendorsModel.findById(corporate[index].vendorId, function(err, vendorInfo){
									if (err) {
										next(err);
									} else {
										console.log(vendorInfo.vendorDetails.vendorEmail);
										//email vendor
										mailOptions.to = vendorInfo.vendorDetails.vendorEmail;
										mailOptions.html = "<b>You are eligible to book ticket for the below flight details <br>"+corporate[index] +" <br>Please Check the below link <br> https://tvs.tripmidas.in/tvs?bid="+corporate[index].adminRequestBidId+"&vid="+ corporate[index].vendorId+"</b>"
										transporter.sendMail(mailOptions);
										
									}
									
									res.json({status:"success", message: "Bid List", data:{}});
								});
								
							
						}
					});
				}			
			}
		});

	},


}					