(function() {
  'use strict';

  var apiTest = require('./specVar');
  var agent = apiTest.agent;
  var mock = apiTest.seed;

  module.exports = function() {

    describe('Initialization of API\n', function() {
      beforeEach(function(done) {
        mock.deleteModels(done);
      });

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
