var express = require('express');
var router = express.Router();
var walletsController = require('../controllers/wallets.js');

router.get('/create', walletsController.create);

router.get('/read', walletsController.read);

router.get('/withdraw/:name', walletsController.withdrawalForm);

router.post('/withdraw/:name', walletsController.withdrawalProcessing);

router.get('/withdraw/atomic/:name', walletsController.withdrawalForm);

router.post('/withdraw/atomic/:name', walletsController.withdrawalProcessingAtomic);

router.get('/drop_collection', walletsController.drop_collection);

router.get('/dropdb', walletsController.drop_db);

module.exports = router;
