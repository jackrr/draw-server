var client = {};

client.display = function(req, res, next){
  res.render('display');
}

module.exports = function(app){
  app.get('/display', client.display)
}