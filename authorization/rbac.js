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
				console.log('authorizeRessource - mongoose find query returned -> err');
			 	res.status(500).send("Error accessing model");

			if (entities.length > 1)
				console.log('authorizeRessource - entities.length > 1');
			 	res.status(500).send("Ressource with more than one ownwer");

			entities.forEach(function(entity){
			  ownerId = entity.ownerID;
			});

			if (!operation) {
				console.log('authorizeRessource - No operation was provided');
				res.status(500).send("No operation was provided");
			}

			try
			{
				if (req.user) {
					rbac
						.can(req.user.role, operation, {userId: req.user.id, ownerId: ownerId})
						.then(result => {
							if (result) {
								console.log('authorizeRessource - access allowed');
								return next();
							} else {
								console.log('authorizeRessource - refuse to acknowledge access denied');
								res.status(400).send("Access denied");
								// to increase ofuscation comment the
								// line above and uncomment the lines below
								// next();
								// return;
							}
						})
						.catch(err => {
							console.log('authorizeRessource - rbac - err ->' + err.message);
							res.status(500).send("I fucked up");
						});
				} else {
					req.flash("error", 'You have to login');
					res.redirect('/sessions/login');
				}
		 }catch(e){
		 		console.log('authorizeRessource - try/catch rbac - err ->' + e.message);
				res.status(500).send(e.message);
		 }
		});
	};
}
function authorize(operation) {
	return function(req, res, next) {

		if (!operation) {
			console.log('authorize - No operation was provided');
			res.status(500).send("No operation was provided");
		}

		try
		{
			if (req.user) {
				rbac
					.can(req.user.role, operation)
					.then(result => {
						if (result) {
							console.log('authorize - access allowed');
							return next();
						} else {
							console.log('authorize - refuse to acknowledge access denied');
							res.status(400).send("Access denied");
							// to increase ofuscation comment the
							// line above and uncomment the lines below
							// next();
							// return;
						}
					})
					.catch(err => {
						console.log('authorizeRessource - rbac - err ->' + err.message);
						res.status(500).send("I fucked up");
					});
			} else {
				req.flash("error", 'You have to login');
				res.redirect('/sessions/login');
			}
		}catch(e){
			console.log('authorize - try/catch rbac - err ->' + e.message);
			res.status(500).send(e.message);
		}
	};
}

module.exports = {authorize: authorize, authorizeRessource: authorizeRessource};