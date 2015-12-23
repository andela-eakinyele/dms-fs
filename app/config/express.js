(function() {
  'use strict';
  var express = require('express');
  var bodyParser = require('body-parser');
  var logger = require('morgan');
  var mongoose = require('mongoose');
  var apiRoutes = require('./../routes');

  // connect database
  mongoose.connect('mongodb://localhost/test', function(err) {
    if (err) {
      console.log('Unable to connect', err);
      return;
    }
    console.log('Connected to database');
  });

  var app = express();

  // configure middleware
  app.use(logger('dev'));
  app.use(bodyParser.urlencoded({
    extended: false
  }));
  app.use(bodyParser.json());

  app.use('/api', apiRoutes);

  app.use('/', function(req, res) {
    var err = new Error('Not Found');
    err.status = 404;
    res.status(err.status).json(err);
  });

  module.exports = app;
})();
