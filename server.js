var express = require('express');
var app = express();

var mobileClient = require('routes/mobile-client');
var displayClient = require('routes/display-client');

app.engine('html', require('ejs').renderFile);

app.get('/', mobileClient.renderHome);
app.get('/display', displayClient.renderRoot);

app.use(function(req, res, next){
  console.log('%s %s', req.method, req.url);
  next();
});


app.use('/public',express.static(__dirname + '/public'));

app.listen(3000);
