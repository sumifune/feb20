var maxFailedCount = 5; // Max tries
var forgetFailedMins = 15; // time the user will be blocked
var blockList = {};
// Check if ip is still allowed
function isAllowed(ip) {
	return !blockList[ip] || blockList[ip].count < maxFailedCount;
}
// Remove ip from blockList
function successfulAttempt(ip) {
	if (blockList[ip]) {
		if (blockList[ip].timeout) {
			clearTimeout(blockList[ip].timeout);
		}
		delete blockList[ip];
	}
}
// Increment blocklist counter
function failedAttempt(ip) {
	if (!blockList[ip]) {
		blockList[ip] = {
			count: 0
		};
	}
	blockList[ip].count++;
	if (blockList[ip].timeout) {
		clearTimeout(blockList[ip].timeout);
	}
	blockList[ip].timeout = setTimeout(function() {
		delete blockList[ip];
	}, forgetFailedMins * 60 * 1000);
}
