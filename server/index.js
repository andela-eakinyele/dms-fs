(function() {
  'use strict';

  var express = require('express');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var apiRoutes = require('./routes');
  var app = express();
  var path = require('path');
  require('./config/initdb')();

  // configure middleware
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  app.use('/api', apiRoutes);

  app.use(express.static(path.join(__dirname, './../public')));

  app.get('/*', function(req, res) {
    res.sendFile('index.html', {
      root: './public/'
    });
  });

  app.use('/', function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status).json(err);
  });

  module.exports = app;

})();
