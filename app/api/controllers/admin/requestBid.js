
const requestBid = require('../../models/admin/requestBid');	
const manageVendors = require('../../models/vendor/manageVendors' );
const submitBid = require('../../models/vendor/submitBid');		
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
    subject: "Tripmidas - You have a ticket to bid", // Subject line
     // html body
  };				

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
		requestBid.create({ travelId: req.body.travelId, travelDetails: req.body.travelDetails, travellerDetails:req.body.travellerDetails,updatedOn: new Date() }, function (err, result) {
				  if (err) 
				  	next(err);
				  else{
					manageVendors.find({}, function(err, vendors){
						if (err){
							next(err);
						} else{
							for (let vendor of vendors) {
								mailOptions.to = vendor.vendorDetails.vendorEmail;
								mailOptions.html = "<b>You have a ticket to bid https://tvs.tripmidas.in/tvs?vid="+vendor._id+"&bid="+result._id+"</b>"
								transporter.sendMail(mailOptions)
							}			
						}

					});
				  res.json({status: "success", message: "Requested for bid successfully", data: result})

				  
				  }
				})
	},


	filterBids: function(req,res,next){
		var date = new Date();
		var myStartDate =new Date(date.getTime() - 30*60000);
	//	res.json({status:"success", message: "Data found!!!",isValid:true, data:{current:date,update:myStartDate}});
	let bidData = [];
		requestBid.find({updatedOn:{$gte:myStartDate,$lt:date}}, function(err, bids){
			if (err){
				next(err);
			} else{
				for (let bid of bids) {
					bidData.push({bid:bid});
					console.log("admin bid id:"+bid._id)
					submitBid.findById(bid._id, function(err, bidInfo){
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

	}


	  

}					