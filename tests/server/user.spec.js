(function() {
  'use strict';
  var apiTest = require('./specVar')();
  var request = apiTest.request;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata.users;
  var groupSeed = apiTest.testdata.groups;
  var keys = ['name.first', 'name.last', 'username', 'password',
    'email'
  ];

  var groupKeys = ['title', 'description', 'passphrase'];


  module.exports = function() {

    var testuser = '';
    var userData = '';
    var token = '';
    var newtoken = '';
    var usersId = '';
    var seedGroupdata = '';
    var groupIds = '';
    var username = 'HAhmed',
      password = 'hahmed';


    describe('Users CRUD\n', function() {
      // seed users
      before(function(done) {

        mock.seedCreate(apiTest.model.user, keys,
            data.seedUsers, 102)
          .then(function(users) {
            userData = users;
            usersId = _.pluck(users, '_id');
            console.log('Seeded Users');

            // seed groups
            mock.seedCreate(apiTest.model.group, groupKeys,
                groupSeed.seedGroups, 114)
              .then(function(groups) {
                seedGroupdata = groups;
                groupIds = _.pluck(groups, '_id');
                console.log('Seeded Groups');

                // update users with group id
                var ids = _.pluck(userData, '_id');
                var updateData = _.map(userData, function(a, index) {
                  a.groupId.push(groupIds[index % 2]);
                  return {
                    groupId: a.groupId
                  };
                });

                // mock updated user data
                mock.seedUpdate(apiTest.model.user, updateData, ids)
                  .then(function(updated) {
                    userData = updated;
                    console.log('Updated seed Users');
                    done();
                  })
                  .catch(function(err) {
                    console.log('Error updating users', err);
                    return;
                  });
              }).catch(function(err) {
                console.log('Error mocking groups', err);
                return;
              });
          }).catch(function(err) {
            console.log('Error mocking users', err);
            return;
          });
      });

      it('- Should persist a valid userdata to database',
        function(done) {
          var userdata = mock.parseData(keys, data.testUsers.tuser1);
          request
            .post('/api/users')
            .type('json')
            .send(userdata)
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              testuser = response;
              assert.equal(response.username + ' ' +
                response.email, 'HAhmed hahmed@project.com');
              done();
            });
        });

      describe('Persistence Validation', function() {

        it('- Should throw validation error for duplicate data: ' +
          'username',
          function(done) {
            var userdata = mock.parseData(keys, data.testUsers.tuser1);
            userdata.username = 'HAhmed123';
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(409)
              .end(function(err) {
                assert.equal(null, err, 'Error encountered');
                done();
              });
          });

        it('- Should throw validation error for duplicate data: ' +
          'email',
          function(done) {
            var userdata = mock.parseData(keys, data.testUsers.tuser1);
            userdata.email = 'hahmed123@project.com';
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(409)
              .end(function(err) {
                assert.equal(null, err, 'Error encountered');
                done();
              });
          });

        /* check email, username, firstname, passsword, empty or
        invalid role*/
        it('- Should throw error for invalid userdata: ' +
          'firstname',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata['name.first'];
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.errors);
                assert.equal(response.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[0]]);
                done();
              });
          });

        it('- Should throw error for invalid userdata: ' +
          'lastname',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata['name.last'];
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.errors);
                assert.equal(response.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[1]]);
                done();
              });
          });

        it('- Should throw error for invalid userdata: ' +
          'username',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata.username;
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.errors);
                assert.equal(response.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[2]]);
                done();
              });
          });

        it('- Should throw error for invalid userdata: ' +
          'password',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata.password;
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.errors);
                assert.equal(response.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[3]]);
                done();
              });
          });

        it('- Should throw error for invalid userdata: ' +
          'email',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata.email;
            request
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.errors);
                assert.equal(response.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[4]]);
                done();
              });
          });
      });

      describe('Authentication of users', function() {

        // users should be logged in before crud
        it('Should require a login/access_token for' +
          ' retrieve or update',
          function(done) {
            request
              .get('/api/users/' + usersId[0])
              .type('json')
              .expect('Content-Type', /json/)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid Token or Key');
                assert.equal(undefined, response.data);
                done();
              });
          });

        // invalid username or password
        it('- Should validate username',
          function(done) {
            var username = 'HAhmed123';
            request
              .post('/api/users/login')
              .type('json')
              .send({
                username: username,
                password: password
              })
              .expect('Content-Type', /json/)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid credentials');
                assert.equal(undefined, response.token,
                  'Token was generated');
                done();
              });
          });

        it('- Should validate password',
          function(done) {
            var password = 'HAhmed123';
            request
              .post('/api/users/login')
              .type('json')
              .send({
                username: username,
                password: password
              })
              .expect('Content-Type', /json/)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Invalid credentials');
                assert.equal(undefined, response.token,
                  'Token was generated');
                done();
              });
          });

        // successful login and token
        it('- Should return a token on Successful login', function(done) {
          request
            .post('/api/users/login')
            .type('json')
            .send({
              username: data.seedUsers.user1[2],
              password: data.seedUsers.user1[3]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              token = response.data.token;
              assert(token, 'Token not generated');
              assert.equal(typeof response.data.expires, 'number');
              assert.equal(response.data.user.username, 'DAdams');
              done();
            });
        });
      });

      describe('Implementing session', function() {

        // token validation and renewal
        it('- Should return a new token if ' +
          'token is still active',
          function(done) {
            request
              .get('/api/session')
              .type('json')
              .send({
                username: data.seedUsers.user1[2],
                password: data.seedUsers.user1[3]
              }).set({
                access_token: token,
                groupid: userData[0].groupId,
                userid: usersId[0]
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                newtoken = response.data.token;
                assert(token, 'Token not generated');
                assert.equal(typeof response.data.expires, 'number');
                assert.equal(response.data.user.username, 'DAdams');
                assert.notEqual(token, newtoken, 'Same token returned');
                done();
              });
          });

        // invalid token response
        it('- Should return a new token if token' +
          ' is still active',
          function(done) {
            var invalidToken = token.substring(2);
            request
              .get('/api/session')
              .type('json')
              .set({
                access_token: invalidToken,
                groupid: userData[0].groupId,
                userid: usersId[0]
              })
              .expect('Content-Type', /json/)
              .expect(500)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Token not validated');
                assert(response.error, 'No error message');
                done();
              });
          });

      });

      describe('Create, retrieve, update and delete', function() {

        // retrieve any user data
        it('- Should retrieve any user data in group', function(done) {
          request
            .get('/api/users/' + usersId[2] + '/?groupId=' +
              userData[0].groupId)
            .set({
              username: userData[0].username,
              access_token: token,
              groupId: userData[0].groupId
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(usersId[2], response._id);
              done();
            });
        });


        // should return not exist for invalid user
        it('- Should not find invalid users', function(done) {
          request
            .get('/api/users/600')
            .set({
              username: userData[0].username,
              access_token: token,
              groupId: userData[0].groupId
            })
            .type('json')
            .expect(400)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(0, response.length, 'Userdata was retrieved');
              done();
            });
        });

        // should be able to retrieve all user data
        it('- Should be able to retrieve all' +
          ' user data in group',
          function(done) {
            request
              .get('/api/users/')
              .set({
                username: userData[0].username,
                access_token: token,
                groupId: userData[0].groupId
              })
              .type('json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.deepEqual(_.pluck(response,
                  '_id'), [102, 104, 106]);
                done();
              });
          });

        // should be able to retrieve all group
        it('- Should be able to retrieve all group',
          function(done) {
            request
              .get('/api/groups')
              .set({
                access_token: token,
              })
              .type('json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.deepEqual(_.pluck(response,
                  '_id'), [113, 114, 115]);
                done();
              });
          });

        // should be able to retrieve a group
        it('- Should be able to retrieve a group',
          function(done) {
            request
              .get('/api/groups/' + groupIds[0])
              .set({
                access_token: token
              })
              .type('json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.deepEqual(response._id, 114);
                done();
              });
          });

        // update own user data
        it('- Should be able to update own data', function(done) {
          var userdata = mock.parseData(keys, data.testUsers.PM);
          userdata.username = 'DAdams_Love';
          request
            .put('/api/users/' + usersId[0])
            .set({
              access_token: token,
              userid: usersId[0]
            })
            .type('json')
            .send(userdata)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.username, 'DAdams_Love');
              userData[0].username = response.username;
              done();
            });
        });

        it('- Should be able to join a group', function(done) {
          seedGroupdata[1].users.push(usersId[0]);
          request
            .put('/api/groups/' + 113)
            .set({
              access_token: token,
              userid: usersId[0]
            })
            .type('json')
            .send({
              users: [200, usersId[0]],
              pass: groupSeed.testGroup[2],
              userid: usersId[0]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.deepEqual(response.users, [200, 102]);
              done();
            });
        });

        // should not be able to delete own userdata
        it('- Should not be able to delete own data', function(done) {
          request
            .delete('/api/users/' + usersId[0])
            .set({
              userid: usersId[0],
              access_token: token
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(403)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.error, 'Unauthorized user');
              done();
            });
        });


        // should not be able to delete other user data
        it('- Should not be able to delete other users data', function(done) {
          request
            .delete('/api/users/' + usersId[1])
            .set({
              userid: usersId[0],
              access_token: token
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(403)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Not authorized');
              assert.equal(response.error, 'Unauthorized user');
              done();
            });
        });

        // should not be able to create Admin user
        it('- Should not be able to create admin user', function(done) {
          var userdata = mock.parseData(keys, data.testUsers.tuser);
          userdata.roles = [{
            _id: 1,
            title: 'Admin'
          }];

          request
            .post('/api/users')
            .set({
              userid: usersId[0],
              access_token: token,
              groupid: 113
            })
            .type('json')
            .send(userdata)
            .expect('Content-Type', /json/)
            .expect(403)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Not authorized ' +
                'to create Admin user');
              assert.equal(response.error, 'Unauthorized user action');
              done();
            });
        });
      });

    });
  };

})();
