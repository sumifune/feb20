const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs"); // bcrypt seems to be deprecated

const SALT_FACTOR = 10;

const UserSchema = mongoose.Schema;

const User = new UserSchema({
	name: { type: String, trim: true, required: true },
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true }
});

// Define pre-save hook
User.pre("save", function(done) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified("password")) {
		return done();
	}

	bcryptjs.genSalt(SALT_FACTOR, function(err, salt) {
		if (err) {
			return done(err);
		}

		bcryptjs.hash(user.password, salt, function(err, hashedPassword) {
			if (err) {
				return done(err);
			}

			user.password = hashedPassword;
			done();
		});
	});
});

// Define a method to verify password validity
User.methods.checkPassword = function(guess, done) {
	// done is a callback
  bcryptjs.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

// Analyse this
// module.exports = User;

module.exports = mongoose.model("User", User);
