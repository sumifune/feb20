var express = require("express");
var router = express.Router();
// var exec = require('child_process').exec;
// // Node.js is resilient to flooding attacks since there’s no limit on
// // the number of concurrent requests and the process is events based.

// // the first line of defense is the server’s firewall.
// // --> nginx

// // ====== Avoid Synchronous Code in Your Application ================

// // Calculating fibonacci number recursively
// function fibonacci(n) {
// 	if (n < 3) {
// 		return 1;
// 	}
// 	return fibonacci(n - 1) + fibonacci(n - 2);
// }

// router.get("/:n*?", function(req, res) {
// 	if (!req.params.n) {
// 		res.send("Hello");
// 		return;
// 	}
// 	// var fib = fibonacci(+req.params.n);
// 	// res.send("Fibonacci nr " + req.params.n + " is " + fib);

// 	console.log('n:' + parseInt(req.params.n));
// 	console.log(__dirname + '/fibonacci-calc.js ');
// 	// Execute the separate calculation file
// 	var cmd = 'node ' + __dirname + '/fibonacci-calc.js ' + parseInt(req.params.n);
// 	exec(cmd, function (err, stdout, stderr) {
// 		//FIXME: We should use execFile here
// 		//FIXME: We should handle possible errors here
// 		console.log(typeof stdout + ' - value:' + stdout);
// 		res.send('Fibonacci nr ' + req.params.n + ' is ' + parseInt(stdout));
// 	});

// });

// ------------------------------------------------------------------------------------

// // Non blocking fibonacci recursive
// function fibonacci(n, cb) {
// 	if (n < 3) {
// 		// return the number in the callback
// 		cb(1);
// 		return;
// 	}
// 	var sum = 0;
// 	function end(subN) {
// 		if (sum !== 0) {
// 			cb(sum + subN);
// 		} else {
// 			sum += subN;
// 		}
// 	}
// 	// Start calculation of previous two numbers
// 	fibonacci(n - 1, end);
// 	fibonacci(n - 2, end);
// }

// router.get("/:n*?", function(req, res) {
// 	if (!req.params.n) {
// 		res.send("Hello");
// 		return;
// 	}
// 	// Execute the separate calculation file
// 	fibonacci(+req.params.n, function(result) {
// 		res.send("Fibonacci nr " + req.params.n + " is " + result);
// 	});
// });

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


module.exports = router;
