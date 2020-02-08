// Force users to use longer passwords
// Disallow common passwords
// Change them periodically
var fs = require("fs");
var dictionary = {};
// Since we are doing it only once on startup then use sync function
fs.readFileSync(__dirname + "/data/500-worst-passwords.txt", "utf8")
	.split("\n")
	.forEach(function(password) {
		dictionary[password] = true;
	});
// This function will return an error message if the password is not good
// or false if it is proper
module.exports.isImproper = function check(username, password) {
	// About 3 percent of users derive the password from the username
	// This is not very secure and should be disallowed
	if (password.indexOf(username) !== -1) {
		throw new Error('Password must not contain the username');
		// return "Password must not contain the username";
	}
	// Compare against dictionary
	if (dictionary[password]) {
		throw new Error("Do not use a common password like: " + password);
		// return "Do not use a common password like: " + password;
	}
	return false;
};
