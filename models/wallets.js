const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const walletSchema = new Schema({
	name: {
		type: String,
		required: true,
		index: { unique: true }
	},
	amount: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("Wallet", walletSchema);