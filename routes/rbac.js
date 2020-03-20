var express = require("express");
var router = express.Router();
var rbacCtrl = require("../controllers/rbac.js");
var rbac = require("../authorization/rbac.js");

router.get(
	"/entity/",
	rbacCtrl.updateProfile
);

router.get(
	"/entity/edit/:id",
	rbac.authorizeRessource("entity:edit",'Entity'),
	rbacCtrl.editEntity
);

router.get(
	"/entity/:name",
	rbac.authorize("entity:read"),
  rbacCtrl.readEntity
);

module.exports = router;
