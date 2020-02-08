var express = require("express");
var router = express.Router();
var sessionsController = require("../controllers/sessions.js");
var passport = require("passport");
const { check, sanitizeBody } = require("express-validator");
const { validationResult, body } = require("express-validator");
const dictVal = require("../authentication/dictionary-validator.js");

router.get("/", sessionsController.root);

router.get("/login", sessionsController.login);

router.post(
	"/login",
	[
		check("email", "Invalid email address")
			.normalizeEmail()
			.isEmail(),
		check("password", "Invalid password")
			.trim()
			.isLength({ min: 3 })
	],
	(req, res, next) => {
		// Finds the validation errors in this request and wraps them
		// in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// get the msg part of the errors
			let arr = [];
			errors.array().forEach(function(e) {
				arr.push(e.msg);
			});
			// res.locals is an object passed to whatever
			// rendering engine the app is using.
			res.locals.errors = arr;
			// errors are passed to the view
			// so that the form can highlight the errors
			// on each text input
			res.render("login");
		} else {
			next();
		}
	},
	passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/sessions/login",
		failureFlash: true
	})
);

router.get("/signup", sessionsController.signup);

router.post(
	"/signup",
	[
		body("name", "Invalid name")
			.trim()
			.isLength({ min: 3 }),
		body("email", "Invalid email")
			.trim()
			.isLength({ min: 5 })
			.bail()
			.isEmail(),
		// Instead of forcing the user to create passwords with
		// special characters that are hard to remember,
		// have them select longer passwords.
		// The resulting hashes take a longer time to crack.
		body("password", "Invalid password")
			.trim()
			.isLength({ min: 3 })
			// .custom(dictVal.isProper(value))
			.custom((value, { req }) => {
				let ret = dictVal.isImproper(req.body.name, value);
				return true;
			})
	],
	(req, res, next) => {
		// Finds the validation errors in this request and wraps them
		// in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// res.locals is an object passed to
			// whatever rendering engine your app is using
			res.locals.errors = errors.array();
			// errors are passed to the view
			res.render("signup", { err: errors.array() });
			// if in development uncomment this and
			// comment the line above
			// return res.status(422).json({ errors: errors.array() });
		} else {
			next();
		}
	},
	sessionsController.signupNewUser,
	passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/sessions/signup",
		failureFlash: true
	})
);

// router.get('/secure', sessionsController.secure);

// router.get('/secure/more', sessionsController.secure_more);

router.get("/logout", sessionsController.logout);

module.exports = router;
