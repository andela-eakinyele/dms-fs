(function() {
  'use strict';
  module.exports = function() {

    var init = require('./initApi');
    var mongoose = require('mongoose');
    var env = process.env.NODE_ENV || 'development';
    var connectUrl;

    if (env === 'development' || env === 'test') {
      connectUrl = process.env.DATABASE_URL;
    } else {
      connectUrl = process.env.MONGOLAB_URI;
    }
    // connect database
    mongoose.connect(connectUrl, function(err) {
      if (err) {
        console.log('Unable to connect', err);
        return;
      }
      init();
      console.log('Connected to database');
    });
  };

})();
