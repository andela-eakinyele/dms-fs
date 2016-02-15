(function() {
  'use strict';



  module.exports = function() {

    var app = require('./../../server');

    var request = require('supertest');
    var User = require('./../../server/models/user');
    var Doc = require('./../../server/models/document');
    var Role = require('./../../server/models/role');
    var Group = require('./../../server/models/group');

    return {
      request: request(app),
      seed: require('./mockMethods'),
      testdata: require('./testData.json'),
      model: {
        user: User,
        doc: Doc,
        role: Role,
        group: Group
      }
    };
  };
})();
