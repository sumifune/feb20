const Entity = require("../models/entities");

exports.updateProfile = function(req, res, next) {
	res.json({ msg: "hola" });
};
exports.editEntity = function(req, res, next) {
	res.send("Editing entity");
};
exports.readEntity = function(req, res, next) {
	var myQuery = Entity.find({ name: req.params.name });
	myQuery.sort({ name: 1 });
	myQuery.select("name city ownerID");
	myQuery.exec(function(err, entities) {
		if (err) {
			res.status(400).send("Error reading documents");
		}
		if (!entities) {
			res.status(400).send("There are no entities");
		}
		res.json(entities);
	});
};
