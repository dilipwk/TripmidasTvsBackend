
const requestBid = require('../../models/admin/requestBid');					

module.exports = {
	getById: function(req, res, next) {
		console.log(req.body);
		requestBid.findById(req.params.movieId, function(err, movieInfo){
			if (err) {
				next(err);
			} else {
				res.json({status:"success", message: "Movie found!!!", data:{movies: movieInfo}});
			}
		});
	},

	getAll: function(req, res, next) {
		let moviesList = [];

		requestBid.find({}, function(err, movies){
			if (err){
				next(err);
			} else{
				for (let movie of movies) {
					moviesList.push({id: movie._id, name: movie.name, released_on: movie.released_on});
				}
				res.json({status:"success", message: "Movies list found!!!", data:{movies: moviesList}});
							
			}

		});
	},


	create: function(req, res, next) {
        console.log(JSON.stringify(req.body));
		requestBid.create({ source: req.body.source, destination: req.body.destination,date:req.body.date,flightIds:req.body.flightIds }, function (err, result) {
				  if (err) 
				  	next(err);
				  else
				  	res.json({status: "success", message: "Requested for bid successfully", data: result});
				  
				});
	},

}					