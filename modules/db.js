var MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    client = new MongoClient(new Server('localhost', 27017)),
    db;

var init = function(callback){
  client.open(function(err, client){
    db = client.db('draw-server');
    callback(db);
  })
}

var getDb = function(callback){
  if (db) return callback(db)
  init(callback)
}

var getActionsCollection = function(callback){
  getDb(function(db){
    db.createCollection('draw-actions', function(err, drawActions){
      if (err) return console.log(err)
      drawActions.ensureIndex({createdAt: -1}, function(err, index){
        if (err) return console.log(err)
        callback(drawActions)
      })
    })
  })
}


module.exports = {
  getDb: getDb,
  getActions: getActionsCollection
}