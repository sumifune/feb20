const mongoose = require('mongoose');
const RBAC = require("easy-rbac");

const rbacOpts = {
	user: {
		// Role name
		can: [
			// list of allowed operations
			"account",
			"post:add",
			{
				name: "post:save",
				when: async params => params.userId === params.ownerId
			},
			"user:create",
			{
				name: "user:*",
				when: async params => params.id === params.userId
			}
		]
	},
	manager: {
		can: [
			"post:save",
			"post:delete",
			"account:*",
			"entity:read",
			// {
			// 	name: "entity:*",
			// 	when: async params => params.id === params.userId
			// },
			{
				name: "entity:edit",
				when: async params =>{ console.log(params);return params.userId === params.ownerId; }
			}
		],
		inherits: ["user"]
	},
	admin: {
		can: ["rule the server"],
		inherits: ["manager"]
	}
};

const rbac = new RBAC(rbacOpts);

function authorizeRessource(operation, model) {
	return function(req, res, next) {
		let ownerId = 1;

		var query = { _id: req.params.id };

		mongoose.model(model).find(query, function(err, entities) {
			if(err)
			 	res.status(500).send("Error accessing model");

			if (entities.length > 1)
			 	res.status(500).send("Ressource with more than one ownwer");

			entities.forEach(function(entity){
			  ownerId = entity.ownerID;
			});

			if (!operation) {
				res.status(500).send("No operation was provided");
			}

			try
			{
				if (req.user) {
					rbac
						.can(req.user.role, operation, {userId: req.user.id, ownerId: ownerId})
						.then(result => {
							if (result) {
								// we are allowed access
								console.log("Allowed");
								next();
							} else {
								// we are not allowed access
								res.status(400).send("Forbidden");
							}
						})
						.catch(err => {
							// something else went wrong - refer to err object
							console.log(err);
							res.status(500).send("I fucked up");
						});
				} else {
					req.flash("error", 'You have to login');
					res.redirect('/sessions/login');
				}

			 }catch(e){
					console.log(e.message);
					res.status(500).send(e.message);
			 }

		});
	};
}
function authorize(operation) {
	return function(req, res, next) {

		if (!operation) {
			res.status(500).send("No operation was provided");
		}

		try
		{
			if (req.user) {
				rbac
					.can(req.user.role, operation)
					.then(result => {
						if (result) {
							// we are allowed access
							console.log("Access allowed");
							next();
						} else {
							// we are not allowed access
							res.status(400).send("Access denied");
						}
					})
					.catch(err => {
						// something else went wrong - refer to err object
						console.log(err);
						res.status(500).send("I fucked up");
					});
			} else {
				req.flash("error", 'You have to login');
				res.redirect('/sessions/login');
			}
		}catch(e){
			console.log(e.message);
			res.status(500).send(e.message);
		}
	};
}

module.exports = {authorize: authorize, authorizeRessource: authorizeRessource};