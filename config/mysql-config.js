var mysql = require("mysql");
var connection = mysql.createConnection({
	host    : "localhost",
	user    : "sakila_client",
	password: "1234",
	database: "sakila"
});

connection.connect();

module.exports = connection;