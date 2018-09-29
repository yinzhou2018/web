const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const classesRouter = require('./classes_router');

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
  res.render('frame', { title: '浏览器云平台管理系统', user: 'yinzhou', main_js_path: 'js/main.js', appId: null });
});

app.get('/apps/:appId', (req, res) => {
  res.render('frame', { title: '浏览器云平台应用管理', user: 'yinzhou', main_js_path: 'js/app.js', appId: req.params.appId, homepage: 'http://localhost:8000' });
});

app.use('/api/classes/:tableName', classesRouter);

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});