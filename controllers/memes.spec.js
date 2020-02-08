var expect = require("chai").expect;
var sinon = require("sinon");
var sinonTest = require("sinon-test");
var test = sinonTest(sinon);

var memesController = require("./memes");
var Meme = require("../models/memes");

var factories = require("../test/factories/factories");

describe("Memes controller", function() {
    beforeEach(function() {
        sinon.stub(Meme, "find");
    });

    afterEach(function() {
        Meme.find.restore();
    });

    it("should send all memes", function() {
        var a = factories.validMeme();
        var b = factories.validMeme();
        var expectedModels = [a, b];
        Meme.find.yields(null, expectedModels);
        var req = { params: {} };
        var res = { send: sinon.stub() };

        memesController.allMemes(req, res);

        sinon.assert.calledWith(res.send, expectedModels);
    });

    it("should query for non-reposts if set as request parameter", function() {
        Meme.find.yields(null, []);
        var req = {
            params: {
                reposts: true
            }
        };
        var res = { send: sinon.stub() };

        memesController.allMemes(req, res);

        sinon.assert.calledWith(Meme.find, { repost: true });
    });
});
