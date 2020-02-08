var User = require("../models/user");
var mail = require("../mail/mail.js");
var async = require("async");
var crypto = require("crypto");

exports.findAll = function(req, res, next) {
	User.find({})
		// .sort({ createdAt: "descending" })
		.exec(function(err, users) {
			if (err) {
				return next(err);
			}
			res.render("users", { users: users });
		});
};

exports.findById = function(req, res, next) {
	User.findOne({ _id: req.params.id }, function(err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return next(404);
		}
		res.render("profile", { user: user });
	});
};

exports.forgottenPasswordInit = function(req, res, next) {
	// Para que usa la template forgot -> user
	res.render("forgot", { user: req.user });
};

exports.forgottenPassword = function(req, res, next) {
	async.waterfall(
		[
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
					var token = buf.toString("hex");
					done(err, token);
				});
			},
			function(token, done) {
				User.findOne({ email: req.body.email }, function(err, user) {
					console.log(req.body.email);
					if (!user) {
						req.flash("error", "No account with that email address exists.");
						return res.redirect("/users/forgot");
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function(err) {
						done(err, token, user);
					});
				});
			},
			function(token, user, done) {
				if (
					// mail.sendPasswordReset(user.email, req.headers.host, token) === true
					mail.dummyFuBoolean(user.email, req.headers.host, token) === true
				) {
					req.flash(
						"info",
						"An email with more instructions has been sent to " + user.email
					);
					done(null, "done");
				} else {
					req.flash(
						"error",
						"Could not send an email to  " +
							user.email +
							" . Please contact our support team."
					);
					done(null, "done");
				}
			}
		],
		function(err) {
			if (err) return next(err);
			res.redirect("/users/forgot");
		}
	);
};

exports.resetTokenInit = function(req, res, next) {
	User.findOne(
		{
			resetPasswordToken: req.params.token,
			resetPasswordExpires: { $gt: Date.now() }
		},
		function(err, user) {
			if (!user) {
				req.flash("error", "Password reset token is invalid or has expired.");
				return res.redirect("/forgot");
			}
			//  ???????????????????????  user ???????????????
			res.render("reset", { user: req.user });
		}
	);
};

exports.resetToken = function(req, res, next) {
	async.waterfall(
		[
			function(done) {
				User.findOne(
					{
						resetPasswordToken: req.params.token,
						resetPasswordExpires: { $gt: Date.now() }
					},
					function(err, user) {
						if (!user) {
							req.flash(
								"error",
								"Password reset token is invalid or has expired."
							);
							return res.redirect("back");
						}

						user.password = req.body.password;
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;

						user.save(function(err) {
							req.logIn(user, function(err) {
								done(err, user);
							});
						});
					}
				);
			},
			function(user, done) {
				if (mail.sendPasswordResetConfirmation(user.email) === true) {
					req.flash("info", "Your password has been changed correctly.");
				} else {
					req.flash(
						"error",
						"Could not change your password. Please contact our support team."
					);
				}
				done(null);
			}
		],
		function(err) {
			res.redirect("/");
		}
	);
};

exports.editUserInit = function(req, res, next) {
	res.render("edit");
};

exports.editUser = function(req, res, next) {
	if (req.body.originalemail === req.body.email) {
		req.user.name = req.body.name;
		// req.user is added by passport
		req.user.save(function(err) {
			if (err) {
				next(err);
				return;
			}
			req.flash("info", "Perfil actualizado!");
			res.redirect("/users/edit");
		});
	} else if (req.body.originalemail !== req.body.email) {
		User.findOne({ email: req.body.email }, function(err, user) {
			if (err) {
				return next(err);
			}
			if (user) {
				req.flash("error", "email already registered.");
				return res.redirect("/users/edit");
			}

			req.user.name = req.body.name;
			req.user.email = req.body.email;

			req.user.save(function(err) {
				if (err) {
					next(err);
					return;
				}
				req.flash("info", "Perfil actualizado!");
				res.redirect("/users/edit");
			});
		});
	}
};
