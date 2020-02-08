var expect = require("chai").expect;
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var entitiesController = require("./entities");
var Entity = require("../models/entities");

var factories = require("../test/factories/factories");


describe('Entities Controller', function () {

    describe('root', function () {

        it('should return a string', test(function () {
            var req = {};
            var res = {
                send: sinon.stub().returns('base API route')
            };
            entitiesController.root(req, res);
            sinon.assert.calledWith(res.send, 'base API route');
        }));

    });

    describe("read", function() {

        beforeEach(function() {
            sinon.stub(Entity, "find");
        });

        afterEach(function() {
            Entity.find.restore();
        });

        it("should read all documents", function() {
            var a = factories.validEntity();
            var b = factories.validEntity();
            var expectedEntities = [a, b];

            var expectedReturnedJsonValue = {
                message: " Reading",
                entities: expectedEntities
            };

            // https://stackoverflow.com/questions/27847377/
            // using-sinon-to-stub-chained-mongoose-calls
            var mockFind = {
                sort: function() {
                    return this;
                },
                select: function() {
                    return this;
                },
                exec: function(callback) {
                    // callback(null, "some fake expected return value");
                    callback(null, expectedEntities);
                }
            };

            Entity.find.returns(mockFind);

            var req = { params: {} };
            var res = {
                json: sinon.stub().returns({
                    message: "Reading from DB",
                    entities: expectedEntities
                })
            };

            entitiesController.read(req, res);
            sinon.assert.calledWith(res.json, expectedReturnedJsonValue);
        });

    });

});