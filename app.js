var express      = require("express");
var app          = express();
var path         = require("path");
var morgan       = require("morgan");
var bodyParser   = require("body-parser");
var cookieParser = require("cookie-parser"); 

var port = process.env.PORT || 80;

// Static files middleware
app.use(express.static(path.resolve(__dirname, "public")));

app.set("view engine", "ejs");

/* Middleware */
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
// app.use(morgan("dev"));


/* Routers */
var homeRouter = require("./routers/home-router.js");

app.use("/", homeRouter);

app.listen(port, function(){
	console.log(`Listening on port ${port}`);
});