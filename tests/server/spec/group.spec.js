(function() {
  'use strict';
  var apiTest = require('./../helpers/spec-var')();
  var request = apiTest.request;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata.groups;
  var userSeed = apiTest.testdata.users;
  var keys = ['title', 'description', 'passphrase'];
  var ukeys = ['name.first', 'name.last', 'username', 'password',
    'email'
  ];

  module.exports = function() {
    var token = '';
    var userData = '';
    var usersId = '';
    var testGroup = '';


    describe('Group Spec', function() {

      before(function(done) {
        // seed users
        mock.seedCreate(apiTest.model.user, ukeys,
            userSeed.groupUsers, 200)
          .then(function(users) {
            userData = users;
            usersId = _.pluck(users, '_id');
            done();
          }).catch(function(err) {
            console.log('Error mocking users', err);
            return;
          });
      });

      // should be authenticated to create a group
      it('- Should require an access_token to' +
        ' create group',
        function(done) {
          var groupData = mock.parseData(keys, data.testGroup);
          groupData.userid = usersId[0];

          request
            .post('/api/groups')
            .type('json')
            .send(groupData)
            .expect(400)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Invalid Token or Key');
              assert.equal(undefined, response.data);
              done();
            });
        });
      // successful login and token
      it('- Should return a token on Successful login', function(done) {
        request
          .post('/api/users/login')
          .type('json')
          .send({
            username: userData[0].username,
            password: apiTest.testdata.users.groupUsers.tuser2[3],
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            token = response.data.token;
            assert(token, 'Token not generated');
            assert.equal(typeof response.data.expires, 'number');
            assert.equal(response.data.user.username, 'EAbbott');
            done();
          });
      });

      it('- Should be able to create a group and ' +
        'assign admin to creator',
        function(done) {
          var groupData = mock.parseData(keys, data.testGroup);
          groupData.userid = usersId[0];
          request
            .post('/api/groups')
            .type('json')
            .set({
              access_token: token
            })
            .send(groupData)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              testGroup = response;
              assert.equal(testGroup.title, 'Hooters');
              assert.deepEqual(testGroup.users, [200]);
              done();
            });
        });
    });

  };
})();
