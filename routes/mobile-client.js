var dbClient = require('../modules/db');

var makeRoutes = function(app, drawActions){
  app.get('/', function(req, res, next){
    res.render('sender');
  });
  

  app.post('/draw-actions', function(req, res, next){
    var action = req.body
    action.createdAt = Date.now()
    drawActions.insert(action, function(err, doc){
      if (err) return console.log(err);
      res.json({message: 'success', action: doc});
    })
  })
}


module.exports = function(app){
  dbClient.getActions(function(drawActions){
    makeRoutes(app, drawActions);
  })
}