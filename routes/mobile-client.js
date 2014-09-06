var client = {}

client.senderPage = function(req, res, next){
  res.render('sender');
}


module.exports = function(app){
  app.get('/', client.senderPage)
}