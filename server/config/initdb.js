(function() {
  'use strict';
  module.exports = function() {

    var init = require('./initApi');
    var mongoose = require('mongoose');
    // connect database
    mongoose.connect(process.env.DATABASE_URL, function(err) {
      if (err) {
        console.log('Unable to connect', err);
        return;
        process.exit(1);
      }
      init();
      console.log('Connected to database');
    });
  };

})();
