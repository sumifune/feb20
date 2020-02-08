var express = require('express');
var router = express.Router();
var entitiesController = require('../controllers/entities.js');
var redisCtrl = require('../controllers/redis.js');


router.get('/', entitiesController.root);

router.get('/create', entitiesController.create);

router.get('/read', entitiesController.read);

router.post('/update/:id', entitiesController.update);

router.get('/delete/:id', entitiesController.delete);

router.get('/drop_collection', entitiesController.drop_collection);

router.get('/dropdb', entitiesController.drop_db);

module.exports = router;
