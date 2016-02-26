(function() {
  'use strict';

  var apiTest = require('./helpers/spec-var')();
  var initSpec = require('./spec/init.spec');
  var roleSpec = require('./spec/role.spec');
  var userSpec = require('./spec/user.spec');
  var docSpec = require('./spec/doc.spec');
  var adminSpec = require('./spec/admin.spec');
  var groupSpec = require('./spec/group.spec');


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
