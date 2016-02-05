(function() {
  'use strict';
  var request = require('supertest');
  var app = require('./../../server');
  var User = require('./../../server/models/user');
  var Doc = require('./../../server/models/document');
  var Role = require('./../../server/models/role');
  var Group = require('./../../server/models/group');


  module.exports = {
    agent: request.agent(app),
    seed: require('./mockMethods'),
    testdata: require('./testData.json'),
    model: {
      user: User,
      doc: Doc,
      role: Role,
      group: Group
    }
  };
})();
