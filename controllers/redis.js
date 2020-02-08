let { redisClient } = require("../redis.js");

exports.summary = function(req, res, next) {
	redisClient.keys("*", function(err, keys) {
		if (err) return console.log(err);

		for (var i = 0, len = keys.length; i < len; i++) {
			console.log(keys[i]);
		}
		res.status(200).json({ keys: keys });
	});
};

exports.setKeyValue = function(req, res, next) {
	var d = new Date();
	redisClient.set("foo" + d.getTime(), d.getTime());
	redisClient.set("bar", d.getTime(), redisClient.print);
	res.status(200).send("Ok");
};

exports.delKeyValue = function(req, res, next) {
	redisClient.del(req.params.key);
	res.status(200).send("Ok");
};

exports.getKeyValue = function(req, res, next) {
	redisClient.exists("foo", function(err, reply) {
		if (err) {
			throw new Error("Scheisse");
		}
		if (reply) {
			res.status(200).send("Ok: " + reply);
		} else {
			res.status(400).send("Ooops");
		}
	});
};
