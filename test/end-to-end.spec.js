let app = require('../app.js');
let chai = require('chai');
let request = require('supertest')("http://localhost:3000/v1/");
// using this configuration, you have to mock the api
// let request = require('supertest')(app);

let expect = chai.expect;

describe.skip('Entities API Integration Tests', function() {
	describe('#GET /read_document', function() {

		it("returns 200", function (done) {
			request
			.get('/read_document/')
			.expect(200)
			.end(function (err, res) {
				done();
			});

		});

	});

});