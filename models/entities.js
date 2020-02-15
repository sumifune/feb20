const mongoose = require("mongoose");

const EntitySchema = mongoose.Schema;

const Entity = new EntitySchema({
	name: { type: String, trim: true, required: true },
	city: { type: String, trim: true, required: true },
	ownerID: { type: String, trim: true, required: true },
});

module.exports = mongoose.model("Entity", Entity);
