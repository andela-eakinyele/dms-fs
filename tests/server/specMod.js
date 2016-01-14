(function() {
  'use strict';
  var request = require('supertest');
  var app = require('./../../server/config/express');

  module.exports = {
    agent: request.agent(app),
    seed: require('./mockMethods'),
    testdata: require('./testData.json')
  };
})();
