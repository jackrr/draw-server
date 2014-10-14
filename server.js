var express = require('express'),
    bodyParser = require('body-parser');
    dbClient = require('./modules/db');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public',express.static(__dirname + '/public'));


app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});

dbClient.getActions(function(drawActions){
  require('./routes/mobile-client')(app, drawActions);
  require('./routes/display')(app, drawActions);

  app.listen(3000);
})