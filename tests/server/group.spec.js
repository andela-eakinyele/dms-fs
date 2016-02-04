(function() {
  'use strict';
  var apiTest = require('./specVar');
  var agent = apiTest.agent;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata.groups;
  var roledata = apiTest.testdata.roles;
  var keys = ['title', 'description', 'passphrase'];

  var ukeys = ['name.first', 'name.last', 'username', 'password',
    'email'
  ];


  module.exports = function() {


    describe('Group Spec\n', function() {
      var token, userData, usersId, testGroup, testRole;

      describe('Create Group', function() {

        before(function(done) {
          mock.seedCreate(apiTest.model.user, ukeys,
              apiTest.testdata.users.groupAdmin, 200)
            .then(function(users) {
              userData = users;
              usersId = _.pluck(users, '_id');
              done();
            }).catch(function(err) {
              console.log('Error mocking users', err);
              return;
            });
        });

        // successful login and token
        it('- Should return a token on Successful login', function(done) {
          agent
            .post('/api/users/login')
            .type('json')
            .send({
              username: userData[0].username,
              password: apiTest.testdata.users.groupAdmin.tuser2[3],
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              token = response.token;
              assert(response.token, 'Token not generated');
              assert.equal(typeof response.expires, 'number');
              assert.equal(response.user.username, 'EAbbott');
              done();
            });
        });

        it('- Should be able to create a group', function(done) {
          var groupData = mock.parseData(keys, data.testGroup);
          groupData.id = usersId[0];
          agent
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
              testGroup = response.data;
              assert.equal(response.message, 'Updated Groups');
              assert.equal(testGroup.title, 'Hooters');
              assert.deepEqual(testGroup.users, [200]);
              done();
            });
        });
      });

      // group admin user create roles
      describe('Group Admin User\n', function() {

        it('- Should be able to create roles for group', function(done) {
          agent
            .post('/api/roles')
            .type('json')
            .set({
              userid: usersId[0],
              access_token: token,
              groupid: testGroup._id
            })
            .send({
              title: roledata.testRole,
              groupId: testGroup._id
            })
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              testRole = response.data;
              assert.equal(response.message, 'Created new Roles');
              assert.equal(testRole.title, 'Manager');
              assert.deepEqual(testRole.groupId, [113]);
              done();
            });
        });
      });

    });

  };
})();
