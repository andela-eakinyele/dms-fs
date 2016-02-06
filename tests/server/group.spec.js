(function() {
  'use strict';
  var apiTest = require('./specVar')();
  var agent = apiTest.agent;
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


    describe('Group Spec', function() {
      var token, userData, usersId, testGroup, adminUser;

      describe(' - Create Group and Group Admin', function() {

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

        // successful login and token
        it('- Should return a token on Successful login', function(done) {
          agent
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
              token = response.token;
              assert(response.token, 'Token not generated');
              assert.equal(typeof response.expires, 'number');
              assert.equal(response.user.username, 'EAbbott');
              done();
            });
        });

        it('- Should be able to create a group and ' +
          'assign admin to creator',
          function(done) {
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
                console.log(err);
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

      describe('User Spec - Group Admin user ', function() {
        it('- Should be able to add admin users for group', function(done) {
          var ukeys = ['name.first', 'name.last', 'username', 'password',
            'email'
          ];
          var userdata = mock.parseData(ukeys, userSeed.testUsers.groupuser);

          userdata.roles = [{
            title: 'Admin',
            _id: 1
          }];
          userdata.groupId = [113];

          agent
            .post('/api/users')
            .type('json')
            .set({
              userid: usersId[0],
              access_token: token,
              groupid: testGroup._id
            })
            .send(userdata)
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              adminUser = response.data;
              assert.equal(response.message, 'Created new Users');
              assert.deepEqual(adminUser.roles, [1]);
              assert.deepEqual(adminUser.groupId, [113]);
              done();
            });
        });
      });

    });

  };
})();
