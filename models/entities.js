const mongoose = require("mongoose");

const EntitySchema = mongoose.Schema;

const Entity = new EntitySchema({
	name: { type: String, trim: true, required: true },
});

module.exports = mongoose.model("Entity", Entity);
