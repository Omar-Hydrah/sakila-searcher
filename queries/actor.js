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

function capitalizeWord(word){
	// Returns the word, with only the first letter as a capital letter.
	// Transforms ALEC JOHN, into Alec John.
	return word.substring(0, 1) + word.substring(1, word.length).toLowerCase();
}

actor.fetchActors = function(firstName, lastName, offset, callback){

	// statement: "select * from actor where first_name like a% and last_name like b% limit 5 offset 5"
	// var actorsQuery = "select concat(first_name, ' ',last_name) as name from actor where first_name like ? ";
	// actorsQuery     += "and last_name like ? limit 5 offset ?";
	// Edited query to match sakila-search.js (front-end)
	var actorsQuery = "select * from actor where first_name like ? and last_name like ? order by first_name asc "; 
	actorsQuery     += "limit 5 offset ? ";

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
			actors.push({
				"firstName": capitalizeWord(results[i].first_name), 
				"lastName" : capitalizeWord(results[i].last_name)
			});
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