var express = require("express");
var router = express.Router();
var userCtrl = require("../controllers/user.js");
const { check, sanitizeBody } = require("express-validator");
const { validationResult, body } = require("express-validator");

// router.get("/", ensureAuthenticatedAdmin, function(req, res, next) {
router.get("/", userCtrl.findAll);

router.get("/forgot", userCtrl.forgottenPasswordInit);

router.post("/forgot", userCtrl.forgottenPassword);

router.get("/reset/:token", userCtrl.resetTokenInit);

router.post("/reset/:token", userCtrl.resetToken);

router.get("/:id", userCtrl.findById);

router.post(
	"/edit",
	// ensureAuthenticated,
	[
		body("name", "Invalid name")
			.trim()
			.isLength({ min: 3 }),
		body("email", "Invalid email")
			.trim()
			.isLength({ min: 5 })
			.bail()
			.isEmail(),
		sanitizeBody("name").escape(),
		sanitizeBody("email")
			.normalizeEmail({ all_lowercase: true })
			.escape() // Check if this is necessary
	],
	(req, res, next) => {
		// Finds the validation errors in this request and wraps them
		// in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// get the msg part of the error objects
			let arr = [];
			errors.array().forEach(function(e) {
				arr.push(e.msg);
			});
			// res.locals is an object passed to
			// whatever rendering engine your app is using
			res.locals.errors = arr;
			// errors are passed to the view
			res.render("edit");
		} else {
			next();
		}
	},
	userCtrl.editUser
);

// router.get("/edit", ensureAuthenticated, userCtrl.editUser);
router.get("/edit", userCtrl.editUserInit);

module.exports = router;
