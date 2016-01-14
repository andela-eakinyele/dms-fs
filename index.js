(function() {
  'use strict';
  var app = require('./server');

  var port = process.env.PORT || 9876;
  app.listen(port);
  console.log('We are on ', port);
})();
