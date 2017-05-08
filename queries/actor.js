var actor = {};
var connection = require("../config/mysql-config.js"); // exports mysql connection

function queryPromise(query, values){
	return new Promise(function(resolve, reject){
		connection.query(query, values, function(error, results, fields){
			if(error){
				reject(error);
			}
			resolve(results);
		});
	});	
}

actor.fetchActors = function(firstName, lastName, offset, callback){

	// statement: "select * from actor where first_name like a% and last_name like b% limit 5 offset 5"
	var actorsQuery = "select concat(first_name, ' ',last_name) as name from actor where first_name like ? ";
	actorsQuery += "and last_name like ? limit 5 offset ?";

	// How many actors where found. Used in pagination.
	var countQuery = "select count(*) as count from actor where first_name like ? and last_name like ?";
	var count = 0;

	// Stores all found actors. 
	// Should not have length bigger than 5 (limit is used inside the query).	
	var actors = [];


	// Querying the count of found actors.
	queryPromise(countQuery, [firstName, lastName])
	.then((results) => {
		count = results[0].count;
		return queryPromise(actorsQuery, [firstName, lastName, offset]);
	}).then((results) => {
		// Querying actors.
		// console.log(results);
		for(var i = 0; i < results.length; i++){
			// console.log(results[i].name);
			actors.push(results[i].name);
		}
		// return actors.push(count);
		// console.log(actors);
		// return actors;
		return callback(null, actors, count);
	}).catch(error =>{
		// throw error;
		return callback(error, null, null);
	});

}


module.exports = actor;