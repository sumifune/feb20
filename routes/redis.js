var express = require('express');
var router = express.Router();
var redisController = require("../controllers/redis.js");

// number of connections, etc
router.get('/summary', redisController.summary);

router.get('/set', redisController.setKeyValue);

router.get('/get', redisController.getKeyValue);

router.get('/del/:key', redisController.delKeyValue);

module.exports = router;