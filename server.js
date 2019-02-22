const express = require('express');
const logger = require('morgan');
const movies = require('./routes/movies') ;
const users = require('./routes/users');
const requestBid = require('./routes/admin/requestBid');
const submitBid = require('./routes/vendor/submitBid');
const manageVendors = require('./routes/vendor/manageVendors');
const createTicket = require('./routes/vendor/createTicket');
const bodyParser = require('body-parser');
const mongoose = require('./config/database'); //database configuration
var jwt = require('jsonwebtoken');
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
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "dilipwk@gmail.com", // list of receivers
    subject: "NODEJS Email  ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  };
  
const app = express();

app.set('secretKey', 'nodeRestApi'); // jwt secret token

// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', function(req, res){
res.json({"tutorial" : "Build REST API with node.js"});
});

// public route
app.use('/users', users);

// private route
app.use('/movies', validateUser, movies);

//request bid
app.use('/requestbid',validateUser,requestBid);

//submit bid
app.use('/submitbid',submitBid);

//Manage Vendors
app.use('/manageVendors',validateUser,manageVendors);

//Create Ticket
app.use('/createTicket',createTicket);

//Send Email
app.use('/sendMail',sendEmail);


app.get('/favicon.ico', function(req, res) {
    res.sendStatus(204);
});

function validateUser(req, res, next) {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function(err, decoded) {
    if (err) {
      res.json({status:"error", message: err.message, data:null});
    }else{
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
  
}

function sendEmail(req,res,next){
  let info = transporter.sendMail(mailOptions)

  console.log("Message sent: %s", info.messageId);
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}


// express doesn't consider not found 404 as an error so we need to handle 404 it explicitly
// handle 404 error
app.use(function(req, res, next) {
	let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// handle errors
app.use(function(err, req, res, next) {
	console.log(err.message);
	
  if(err.status === 404)
  	res.status(404).json({message: "Not found"});
  else	
    res.status(500).json({status: "failed", message: "Error: "+ err.message});

});

app.listen(3010, function(){
	console.log('Node server listening on port 3010');
});
