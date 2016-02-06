(function() {
  'use strict';

  var apiTest = require('./specVar');
  var agent = apiTest.agent;

  module.exports = function() {

    describe('Initialization of API\n', function() {

      // should respond to root route
      it('- API should respond to root', function(done) {
        agent
          .get('/api')
          .set('Accept', 'application/json')
          .expect(200, {
            'message': 'Welcome to the Document Management System'
          }, done);
      });
    });

  };
})();
