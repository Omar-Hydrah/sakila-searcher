/* A file to test promises on the database */
var connection = require("./config/mysql-config.js");

var countQuery = "select count(*) as count from actor where first_name like ? and last_name like ?";
var selectQuery = "select concat(first_name, ' ',last_name) as name from actor where first_name like ? ";
selectQuery    += "and last_name like ? limit 5 offset ?";

function queryPromise(query, values){

	return new Promise(function(resolve, reject){
		connection.query(query, values, function(error, results, fields){
			if(error){
				reject(error);
			}
			// console.log(results);
			resolve(results);
		});
	});
} 

var count = 0;
var actorsResult = [];
queryPromise(countQuery, ["John%", "%"])
.then(results =>{
	count = results[0].count;
	return queryPromise(selectQuery, ["John%", "%", 0]);
}).then(results =>{
	actorsResult = results;
	connection.end();
	console.log(count);
	console.log(actorsResult);
}).catch(error =>{
	throw error;
});
/*queryPromise(countQuery, ["John%", "%"])
	.then(function(results){
		count = results[0].count;
		queryPromise(selectQuery, ["John%", "%", 0]).
			then(function(actors){
				actorsResult = actors;
			}).catch(function(error){
				throw error;
			});
	}).catch(function(error){
		throw error
	});*/