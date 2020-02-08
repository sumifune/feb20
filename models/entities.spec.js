var expect = require("chai").expect;
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var Entity = require("./entities.js");
var factories = require("../test/factories/factories");


describe("Entity model", function() {
	it("should be invalid if name is empty", function(done) {
		var m = new Entity();

		m.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});

	it("should be valid if called with a valid entity", function(done) {
		var m = new Entity(factories.validEntity());

		m.validate(function(err) {
			expect(err).to.be.null;
			done();
		});
	});

});
