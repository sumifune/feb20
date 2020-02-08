var expect = require("chai").expect;
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var Meme = require("./memes.js");

describe("Meme model", function() {
	it("should be invalid if name is empty", function(done) {
		var m = new Meme();

		m.validate(function(err) {
			expect(err.errors.name).to.exist;
			done();
		});
	});

	it("should be valid if name is NOT empty", function(done) {
		var m = new Meme({ name: "Manolete" });

		m.validate(function(err) {
			expect(err).to.be.null;
			done();
		});
	});

	it("should have validation error for repost if not dank", function(done) {
		//1. set up the model in a way the validation should fail
		var m = new Meme({ repost: true });

		//2. run validate
		m.validate(function(err) {
			//3. check for the error property we need
			expect(err.errors.repost).to.exist;
			done();
		});
	});

	it("should be valid repost when dank", function(done) {
		//1. set up the model in a way the validation should succeed
		var m = new Meme({ repost: true, dank: true });

		//2. run validate
		m.validate(function(err) {
			//3. check for the error property that shouldn't exist now
			expect(err.errors.repost).to.not.exist;
			done();
		});
	});

	it("should check for reposts with same name", test(function() {
			this.stub(Meme, "findOne");
			var expectedName = "This name should be used in the check";
			var m = new Meme({ name: expectedName });

			m.checkForReposts(function() {});

			sinon.assert.calledWith(Meme.findOne, {
				name: expectedName,
				repost: true
			});
		})
	);

	it('should call back with true when repost exists', test(function(done) {
	    var repostObject = { name: 'foo' };
	    this.stub(Meme, 'findOne').yields(null, repostObject);
	    var m = new Meme({ name: 'some name' });

	    m.checkForReposts(function(hasReposts) {
	        expect(hasReposts).to.be.true;
	        done();
	    });
	}));

});
