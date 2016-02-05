(function() {
  'use strict';
  var initSpec = require('./init.spec');
  var roleSpec = require('./role.spec');
  var userSpec = require('./user.spec');
  var docSpec = require('./doc.spec');
  var adminSpec = require('./admin.spec');
  var groupSpec = require('./group.spec');

  var apiTest = require('./specVar');

  describe('Testing API Routes', function() {
    after(function(done) {
      apiTest.seed.deleteModels(done);
    });


    initSpec();
    groupSpec();
    roleSpec();
    userSpec();
    docSpec();
    adminSpec();

  });
})();
