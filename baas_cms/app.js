const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const appsRouter = require('./apps_router');

var app = express();

app.set('views', `${__dirname}/public/views`);
app.set('view engine', 'ejs');

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.render('frame', { user: 'yinzhou', main_js_path: 'js/main.js', appId: null });
});

app.use('/api/app', appsRouter);

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});