var mysql = require("mysql");
var localHost = {
	host    : "localhost",
	user    : "sakila_client",
	password: "1234",
	database: "sakila"
};

var remoteHost = {
	host    : "db4free.net",
	user    : "omar_alsalahy",
	password: "123456",
	database: "omar_sakila"
};
var connection = mysql.createConnection(remoteHost);



connection.connect();

module.exports = connection;