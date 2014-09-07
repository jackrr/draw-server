var express = require('express'),
    bodyParser = require('body-parser');

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


require('./routes/mobile-client')(app);

app.listen(3000);