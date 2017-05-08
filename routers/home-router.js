var router = require("express").Router(); 

router.get("/", function(req, res){
	res.render("index");
});

router.get("/find-actor", function(req, res){

	// Request came from ajax.
	if (req.headers["X-Requested-With"] == "XMLHttpRequest" ){
		res.end("Ajax Request");
	}else{
		res.end("Browser Request");
	}
});

module.exports = router;