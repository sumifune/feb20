const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs"); // bcrypt seems to be deprecated
const crypto = require("crypto");
const myCrypt = require("../lib/crypt");

const SALT_FACTOR = 10;

const UserSchema = mongoose.Schema;

const User = new UserSchema({
	name: { type: String, trim: true, required: true },
	email: { type: String, required: true, index: { unique: true } },
	password: { type: String, required: true },
	encryptedKey: {
		type: String,
		required: true,
		default: encryptKey
	},
	role: { type: String, trim: true, required: true }
});

function encryptKey() {
	console.log(this.password);
	return myCrypt.encrypt(crypto.randomBytes(21).toString("hex"), this.password);
}

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
		// ACHTUNG BABY
		// Passwords should never be stored as plaintext, but even salted
		// hashed passwords can be susceptible to brute-force attack using custom hardwar

		// swap bcryptjs to scrypt-kdf
		// it's safer
		// https://github.com/chrisveness/scrypt-kdf
		bcryptjs.hash(user.password, salt, function(err, hashedPassword) {
			if (err) {
				return done(err);
			}

			user.password = hashedPassword;
			// This is going to execute SYNC
			// Change it to ASYNC
			// Probably using setImmediate

			// Changing the password means loosing the CCs encrypted

			// although it is not necessary because crypto is executed in the thread pol
			// user.encryptedKey = myCrypt.encrypt(
			// 	user.encryptionKey,
			// 	user.password
			// );
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
