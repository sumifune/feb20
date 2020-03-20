function someFn(input, callback) {
	if (input.hasError) {
		// setImmediate(callback, new Error('Invalid input'));
		callback(new Error('Invalid input'));

		return;
	}
	// Do our stuff
	console.log('no llego');
}

function useSomeFn(req, res) {
	// Start information query as soon as possible
	someFn({ hasError: true }, function(err, data) {
		if (err) {
			// res.send(500);
			console.log('res.send(500);');
			return;
		}
		// res.json(data);
		console.log('res.json(data)');
	});
	// Set some cookies in the meantime
	// res.cookie("my", "cookie");
	console.log('res.cookie("my", "cookie");');
}

// function myCB(value) {
// 	console.log(value);
// }

// let i = { hasError: true };
req = { };
res = { };

useSomeFn();
