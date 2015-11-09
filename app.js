var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var helpers = require('./lib/helpers');
var logger = require('./lib/logger');

var routes = require('./routes/index');

var app = express();

app.use(require('morgan')("combined", { "stream": logger.stream }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', exphbs({
  defaultLayout: 'layout',
  extname: '.hbs',
  // helpers: require('./public/js/helpers.js').helpers, // same file that gets used on our client
  partialsDir: 'views/partials/', // same as default, I just like to be explicit
  layoutsDir: 'views/layouts/', // same as default, I just like to be explicit
  helpers: helpers
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('*', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  logger.debug('404 Warning. URL: ' + req.url);
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    logger.debug('Error: ' + (err.status || 500).toString() + ' ' + err);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  logger.debug('Error: ' + (err.status || 500).toString() + ' ' + err);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
