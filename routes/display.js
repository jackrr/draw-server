var os = require('os')

module.exports = function(app, drawActions){
  var ip = os.networkInterfaces().en0.filter(function(addr){
    return addr.family == 'IPv4'
  })[0].address

  app.get('/display', function(req, res, next){
    res.render('display', { ip: ip });
  });

  app.get('/draw-actions', function(req, res, next){
    var time = (req.params.timestamp ? parseInt(req.query.timestamp) : 0)
    var query = { 
      createdAt: { $gt: time }
    }
    drawActions.find(query).toArray(function(err, docs){
      if (err) return console.log(err);
      res.json(docs);
    })
  })

  app.get('/draw-actions/after/:timestamp', function(req, res, next){
    var time = (req.params.timestamp ? parseInt(req.params.timestamp) : 0)
    var query = { 
      createdAt: { $gt: time }
    }
    drawActions.find(query).toArray(function(err, docs){
      if (err) return console.log(err);
      res.json(docs);
    })
  })
}