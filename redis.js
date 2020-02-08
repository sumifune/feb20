var redis = require("redis");

let redisClient = redis.createClient({
	host: "redis",
	port: 6379,
	// password: 'funky password here', // no creo que use esto  -ALLOW_EMPTY_PASSWORD=yes in dc file
	db: 2 // Map authentications DB to avoid parallel login attempts
});
redisClient.unref();
// redisClient.on("error", console.log);
redisClient.on("error", function(err) {
	console.log("Something went wrong " + err);
});
redisClient.on("connect", function() {
	console.log("Redis client connected - redis controller");
});

module.exports = { redisClient };