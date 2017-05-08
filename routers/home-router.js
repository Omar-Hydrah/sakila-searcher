var router     = require("express").Router(); 
var connection = require("../config/mysql-config.js");
var Actor      = require("../queries/actor.js");

router.get("/", function(req, res){
	res.render("index");
});

router.get("/find-actor/:actorName/:offset", function(req, res){

	/*
	Previous method:
		If the user types a string like 'Ahmad a', it would be saved in the nameArray as:
			nameArray[0] = 'Ahmad', nameArray[1] = 'a'
		If the user types a string like 'Ahmad', it would be saved in the nameArray as:
			nameArray[0] = 'Ahmad'
			And nameArray[1] will be "undefined". If so, then lastName will eqaul %.
			This way, the query wouldn't rely on the last name, and will get results
			based on first name only.
	// var nameArray = (actorName.indexOf(" ") != -1 ) ? actorName.split(" ") : [actorName + "%" ];
	// var firstName = nameArray[0];
	// var lastName  = (typeof(nameArray[1]) != "undefined" ) ? nameArray[1] : "%";
	*/

	// Request came from ajax.
	/*if (req.headers["x-requested-with"] == "XMLHttpRequest" ){
		res.end("Ajax Request");
	}else{
		res.end("Browser Request");
	}*/

	var actorName = req.params.actorName;

	// var offset = (req.params.offset.match(/^\d+$/).index != -1 ) ? parseInt(req.params.offset) : 0 ;
	// Making sure that an int is being passed.
	var offset = isNaN(req.params.offset) ? 0 : parseInt(req.params.offset);


	// If there's no space inside the actorName, take it as the firstName.
	// 		else, take only the part before the space for the firstName variable.
	var firstName = (actorName.indexOf(" ") == -1 ) ? actorName : actorName.split(" ")[0];
	// If there's a space inside the actorName, take the part after the space.
	// 		else, make lastName empty.
	var lastName  = (actorName.indexOf(" ") != -1) ? actorName.split(" ")[1] : "";

	// appending a '%' because of the 'like' keyword inside the query.
	firstName += "%"; 
	lastName  += "%";
	
	// Fetches actors from the database, and returns a callback.
	Actor.fetchActors(firstName, lastName, offset, function(error, actors, count){
		if(error){
			throw error;
		}

		// Making sure that the actors is an array, and count is a number.
		if(Array.isArray(actors) && !isNaN(count)){
			actors.push(count);
			res.json(actors);
			// res.end(actors);
		}else{
			res.json("{'error': 'Error occurred'}");
		}
	});

	/*// Making the query to count first.
	var request = new Promise(function(resolve, reject){
		connection.query(countQuery, [firstName, lastName], function(error, results, fields){
			if(error){
				reject(error);
			}
			count = results[0].count;
			resolve(count);
		});
	});

	// Making the query to retrieve actors.
	request.then(function(count){

		// console.log(`Count: ${count}`);
		connection.query(query, [firstName, lastName, offset], function(error, results, fields){
			if(error){
				reject(error);
			}
			for(var i = 0; i < results.length; i++){
				// Capturing the actor's name, and appending it to the actors array.
				actors.push(results[i].name);
			}
		});
	}).catch(function(error){
		throw error;
	}); */

	

});

// connection.end();
module.exports = router;