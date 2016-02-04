(function() {
  'use strict';
  var initSpec = require('./initSpec');
  var roleSpec = require('./roleSpec');
  var userSpec = require('./userSpec');
  var docSpec = require('./docSpec');
  var adminSpec = require('./adminSpec');
  var groupSpec = require('./group.spec');

  var apiTest = require('./specVar');

  describe('Testing API Routes', function() {
    after(function(done) {
      apiTest.seed.deleteModels(done);
    });

    initSpec();
    groupSpec();
    // roleSpec();
    userSpec();
    // docSpec();
    // adminSpec();

  });
})();
