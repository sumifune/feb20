var Meme = require("../models/memes");

module.exports.allMemes = function(req, res) {
	Meme.find({ repost: req.params.reposts }, function(err, memes) {
		res.send(memes);
	});
};
