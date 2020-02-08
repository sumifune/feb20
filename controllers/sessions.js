var User = require("../models/user");
var passport = require("passport");
const { validationResult } = require('express-validator');

exports.root = function(req, res) {
	// updating a session properties triggers an maxage value update
	if (!req.session.views) {
		req.session.views = 0;
	}
	req.session.views++;
	res.render("index", { sessionID: req.sessionID });
};

exports.login = function(req, res) {
	// req.flash is used by passport to inform the user
	res.render("login", { err: req.flash("error") });
};

exports.logout = function(req, res) {
	req.logout();
	req.session.destroy();
	res.redirect("/");
};

exports.signup = function(req, res) {
	// req.flash is used by passport to inform the user
	res.render("signup", { err: req.flash("error") });
};

exports.signupNewUser = function(req, res, next) {

	var name = req.body.name;
	var email = req.body.email.toLowerCase();
	var password = req.body.password;

	User.findOne({ email: email }, function(err, user) {
		if (err) {
			return next(err);
		}
		if (user) {
			req.flash("error", "Email already registered");
			return res.redirect("/sessions/signup");
		}
		var newUser = new User({
			name: name,
			email: email,
			password: password
		});
		newUser.save(next);
	});
};

// exports.login = function(req, res) {
// 	req.session.login(function(err) {
// 		res.send("ok - " + req.session._loggedInAt);
// 	});
// };

// exports.secure_more = function(req, res) {
// 	if (!req.session.isFresh()) {
// 		console.log("Not fresh");
// 		// Check if session is fresh
// 		res.status(401).send("Not fresh");
// 		return;
// 	}
// 	res.send("You are fresh");
// };
