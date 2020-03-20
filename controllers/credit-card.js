var CC = require("../models/credit-card");
const myCrypt = require("../lib/crypt.js");

exports.add = function(req, res) {
  let encryptionKey = 0;
  if (req.session) {
    encryptionKey = req.session.encryptionKey;
  } else {
    return res.json({ message: "Not logged in" });
  }

  let cc;
  if (req.query.cc) {
    cc = req.query.cc;
  } else {
    return res.json({ message: "A credit card number must be provided" });
  }

  var newEntity = new CC({ cc: myCrypt.encrypt(cc, encryptionKey) });

  newEntity.save(function(err) {
    if (err) {
      console.log(err);
      res.status(400).send("Unable to save CC in database");
    } else {
      res.json({ message: "Saved in DB" });
    }
  });
};

// exports.getOne = function(req, res, next) {
//  CC.findOne({ _id: '111111111111111' }, function(err, cc) {
//    if (err) {
//      return next(err);
//    }
//    if (!cc) {
//      return next(404);
//    }
//    res.json({ cc: cc });
//  });
// };

exports.listAll = function(req, res, next) {
  var myQuery = CC.find({});
  myQuery.exec(function(err, ccs) {
    if (!err) {
      res.json({ ccs: ccs });
    } else {
      res.status(400).send("Error reading documents");
    }
  });
};

exports.listAllDecrypted = function(req, res, next) {

  let encryptionKey = 0;
  if (req.session) {
    encryptionKey = req.session.encryptionKey;
  } else {
    return res.json({ message: "Not logged in" });
  }

  function decryptCCProperty(ccs) {
    ccs.cc = myCrypt.decrypt(ccs.cc, encryptionKey);
    return ccs;
  }

  var myQuery = CC.find({});
  myQuery.exec(function(err, ccs) {
    if (!err) {
      let decrypted_array = [];
      for (var i = 0; i < ccs.length; i++) {
        decrypted_array.push(decryptCCProperty(ccs[i]));
      }

      res.json({ ccs: decrypted_array });
    } else {
      res.status(400).send("Error reading documents");
    }
  });
};

exports.drop_collection = function(req, res) {
  // https://stackoverflow.com/questions/11453617/mongoose-js-remove-collection-or-db
  CC.collection.drop(function(err, result) {
    if (err) {
      res.status(400).send(err);
    } else {
      res.json({ message: " Dropped collection CC", result: result });
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
