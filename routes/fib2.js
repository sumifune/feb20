

// Non blocking fibonacci recursive
// NOTE: it is slow
function fibonacci(n, cb) {
	if (n < 3) {
		// return the number in the callback
		// as resources allow
		setImmediate(cb, 1);
		return;
	}
	var sum = 0;
	function end(subN) {
		if (sum !== 0) {
			setImmediate(cb, sum + subN);
		} else {
			sum += subN;
		}
	}
	// Start calculation of previous two numbers
	setImmediate(fibonacci, n - 1, end);
	setImmediate(fibonacci, n - 2, end);
}
router.get("/:n*?", function(req, res) {
	if (!req.params.n) {
		res.send("Hello");
		return;
	}
	// Execute the separate calculation file
	fibonacci(+req.params.n, function(result) {
		res.send("Fibonacci nr " + req.params.n + " is " + result);
	});
});
