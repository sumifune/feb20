const mongoose = require("mongoose");
const crypt = require("../lib/crypt.js");

const CCSchema = mongoose.Schema;

const CC = new CCSchema({
	cc: { type: String, trim: true, required: true }
});

// Define a pre save hook to encrypt
CC.pre("save", function(next) {
	// Encrypt the creditcard
	// this.cc = crypt.encrypt(this.cc, this.$encryptionKey);
	next();
});

// Define a pre init hook to decrypt
CC.pre("init", function(data) {
  // Decrypt the credit card
  // data.cc = crypt.decrypt(data.cc, this.$encryptionKey);
  // data.cc = '464664';
});

module.exports = mongoose.model("CC", CC);
