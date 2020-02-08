const Wallet = require("../models/wallets");
const mongoose = require("mongoose");

// Our processing function
function processCall(cb) {
	// Add delay of 5 seconds here - imitating processing of the request
	setTimeout(cb, 7000);
}

exports.create = function(req, res) {
	// pass an array of docs
	let newWallets = [
		{ name: "karl", amount: 1000 },
		{ name: "mikk", amount: 1000 }
	];

	Wallet.create(newWallets, function(err, wallets) {
		if (err) {
			res.status(400).send("Unable to save wallets to database");
		} else {
			res.json({ wallets: wallets });
		}
	});
};

exports.read = function(req, res) {
	var myQuery = Wallet.find({});
	myQuery.sort({ name: 1 });
	// myQuery.select('name amount');
	myQuery.exec(function(err, wallets) {
		if (!err) {
			res.json({ message: " Reading", wallets: wallets });
		} else {
			res.status(400).send("400 reading documents");
		}
	});
};

exports.withdrawalForm = function(req, res, next) {
	// Query the account based on url parameters
	Wallet.findOne({ name: req.params.name }, function(err, wallet) {
		if (err) {
			next(err);
			return;
		}
		if (!wallet) {
			res.status(400).send("Kein Wallet");
			return;
		}

		// Send information and withdrawal form
		res.send(
			"<p> You have: " +
				wallet.amount +
				".<br/>" +
				"How much do you want to withdraw?</p>" +
				'<form method="POST">' +
				'<input type="number" name="amount" />' +
				'<input type="submit" value="submit" />' +
				"</form>"
		);

	});
};

exports.withdrawalProcessing = function(req, res, next) {
	var amount = Math.abs(req.body.amount);
	Wallet.findOne({ name: req.params.name }, function(err, wallet) {
		if (err) {
			// Something went wrong with the query
			next(err);
			return;
		}
		if (!wallet) {
			res.status(404).send("Not found");
			return;
		}
		if (wallet.amount < amount) {
			res.status(404).send("Insufficient funds");
			return;
		}


		processCall(function () {
			// body...
			wallet.amount -= amount;
			wallet.save(function(rErr, updatedWallet) {
				if (rErr) {
					res.status(500).send("Withdrawal failed");
					return;
				}
				console.log(updatedWallet);

				res.redirect("/wallets/withdraw/" + req.params.name);
			});
		});

	});
};

exports.withdrawalProcessingAtomic = function(req, res, next) {
	var amount = Math.abs(req.body.amount);

	// Search by name and amount greater than or equal to requested
	var search = {name: req.params.name, amount: {$gte: amount}};
	// Increment by negative amount
	var update = {$inc: {amount: -amount}};


	Wallet.findOneAndUpdate(search, update, function (err, wallet) {

		if (!wallet) {
			res.status(404).send("Not found");
		}
		if (wallet.amount < amount) {
			res.status(404).send("Insufficient funds");
		}
		var today = new Date();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		console.log("T1" + time + " Amount: " + wallet.amount);

		processCall(function (err) {

			console.log('2222222222222222222222222222222222222222222222');

			if(err) {
				console.log('Error in findOneAndUpdate');
				// Process failed so reimburse
				wallet.amount += amount;
				wallet.save(function (rErr, updatedWallet) {
					if(rErr) {
						//TODO: This needs careful handling
						console.error('Reimbursement failed');
						res.status(500).send("Withdrawal failed (Reimbursement failed) - SEVERE ERROR");
					}
					if (updatedWallet)
						res.status(500).send("Process failed - Reimbursement carried out correctly");
				});
			}

			res.redirect("/wallets/withdraw/atomic/" + req.params.name);

		});

	});
};

exports.drop_collection = function(req, res) {
	// https://stackoverflow.com/questions/11453617/mongoose-js-remove-collection-or-db
	Wallet.collection.drop(function(err, result) {
		if (err) {
			res.status(400).send(err);
		} else {
			res.json({ message: " Dropped collection", result: result });
		}
	});
	// or the old way - if not sharkinfo.venues try just venues
	// mongoose.connection.db.dropCollection('sharkinfo.venues', function(err, result) {
	//   if (err){
	//     res.status(400).send(err);
	//   }else{
	//     res.json({ message: ' Dropped collection', result: result });
	//   }
	// });
};

exports.drop_db = function(req, res) {
	console.log('msg');
	mongoose.connection.db.dropDatabase(function(err, result) {
		if (err) {
			console.log('sdfsdfsdfsdf');
			res.status(400).send(err);
		} else {
			console.log('sdfsfsfsdf................');
			res.json({ message: " Dropped db", result: result });
		}
	});
};
