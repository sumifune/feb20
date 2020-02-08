var chai = require("chai");
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var greet = require('../libraries/misc');

describe("Misc library", function() {

    it("should return the correct value", test(function() {

			const name = 'morgan';
			const expected = `hello ${name}`;

			const greetSpy = this.spy(greet);
			greetSpy(name);

			greetSpy.should.have.returned(expected);
    	})
    );

});