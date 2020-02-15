const Entity = require('../models/entities');
const mongoose = require('mongoose');


exports.root = function(req, res) {
  res.send('base API route');
};

// ---------------- CRUD operations --------------------------------

exports.create = function(req, res){

  let date_now = Date.now();

  let ownerID = 0;
  if (req.user) {
    ownerID = req.user.id;
  }
  var newEntity = new Entity({name: 'E1', city: 'Lugo', ownerID: ownerID});

  newEntity.save(function (err) {
    if(err) {
      res.status(400).send('Unable to save Entity to database');
    } else {
      res.json({ message: date_now + ' saved in DB' });
    }
  });
};

exports.read = function(req, res){

  var myQuery = Entity.find({});
  myQuery.sort({name: 1});
  myQuery.select('name city ownerID');
  myQuery.exec(function (err, entities){
    	console.log('-------------- -------------------------------------');
    	console.log(entities);
    	console.log('---------------------------------------------------');
    if (!err){
      res.json({ message: ' Reading', entities: entities });
    }else{
      res.status(400).send('Error reading documents');
    }
  });

};

exports.update = function (req, res) {
    return Entity.findByIdAndUpdate(req.params.id, req.body, { new: true }, function (err, entity) {
        if (err) {
            return res.status(500).end();
        }
        else if (!entity) {
            return res.status(404).end();
        }
        else {
            return res.json(entity);
        }
    });
};

exports.delete = function (req, res) {

    return Entity.findByIdAndRemove(req.params.id, function (err, entity) {
        if (err) {
            return res.status(500).end();
        }
        else if (!entity) {
            return res.status(404).end();
        }
        else {
            return res.json({ "message": "Entity deleted successfully!" });
        }
    });
};

exports.drop_collection = function(req, res){

  // https://stackoverflow.com/questions/11453617/mongoose-js-remove-collection-or-db
  Entity.collection.drop(function(err, result) {
    if (err){
      res.status(400).send(err);
    }else{
      res.json({ message: ' Dropped collection', result: result });
    }
  });
  // or the old way - if not sharkinfo.venues try just venues
  // mongoose.connection.db.dropCollection('sharkinfo.venues', function(err, result) {
  //   if (err){
  //     res.status(400).send(err);
  //   }else{
  //     res.json({ message: ' Dropped collection', result: result });
  //   }
  // });

};

exports.drop_db = function(req, res){

  mongoose.connection.db.dropDatabase(function(err, result) {
    if (err){
      res.status(400).send(err);
    }else{
      res.json({ message: ' Dropped db', result: result });
    }
  });

};

// exports.drop_db = function(req, res){
  //  EXAMPLE _ USING PROMISES
  // const todo = new Todo({
  // text: req.body.text,
  // completedAt: Date.now()
  // });
  // todo
  // .save()
  // .then(todos => res.redirect('/'))
  // .catch(err => res.status.send(err));
// };