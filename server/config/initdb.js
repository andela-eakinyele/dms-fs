(function() {
  'use strict';
  module.exports = function() {

    var mongoose = require('mongoose');
    // connect database
    mongoose.connect('mongodb://localhost/test', function(err) {
      if (err) {
        console.log('Unable to connect', err);
        return;
      }
      console.log('Connected to database');
    });
  };

})();
