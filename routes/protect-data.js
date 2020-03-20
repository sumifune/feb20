var express = require("express");
var router = express.Router();
var ctrlCreditCard = require("../controllers/credit-card.js");

// Define middleware
function noStore(req, res, next) {
	res.header("Cache-Control", "no-store"); // Set the header so it is not stored
	next(); // Continue
}

// Use middleware
router.get("/data", noStore, function(req, res, next) {
	var data = "Let this be our sensitive data";
	res.send(data);
});

// set up autocomplete on sensitve data
router.get("/autocomplete", noStore, function(req, res, next) {

	let htmlform = `<form method="POST" action="/saveData" autocomplete="off">
		<input type="text" name="sensitive" />
		<input type="submit" value="Submit" />
	</form>`;

	res.send(htmlform);

});

router.get("/creditcard/add",ctrlCreditCard.add);
// router.get("/creditcard/update",ctrlCreditCard.getOne);
router.get("/creditcard/list",ctrlCreditCard.listAll);
router.get("/creditcard/ldec",ctrlCreditCard.listAllDecrypted);
router.get("/creditcard/drop",ctrlCreditCard.drop_collection);

//  mask the information in the logs **** **** **** 3456
//  TODO
module.exports = router;
