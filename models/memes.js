var mongoose = require("mongoose");

function validator(v) {
	return v === true && this.dank === true;
}

var memeSchema = new mongoose.Schema({
	name: { type: String, required: true },
	dank: { type: Boolean },
	repost: {
		type: Boolean,
		validate: validator
	}
});

memeSchema.methods.checkForReposts = function(cb) {
    this.model('Meme').findOne({
        name: this.name,
        repost: true
    }, function(err, val) {
        cb(!!val);
    });
};

module.exports = mongoose.model("Meme", memeSchema);
