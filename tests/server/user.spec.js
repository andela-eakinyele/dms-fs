(function() {
  'use strict';
  var apiTest = require('./specVar');
  var agent = apiTest.agent;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata.users;
  var groupSeed = apiTest.testdata.groups;
  var keys = ['name.first', 'name.last', 'username', 'password',
    'email'
  ];

  module.exports = function() {

    describe('Users CRUD\n', function() {
      var testuser, userData, token, usersId, seedGroupdata, groupIds;

      // seed users
      before(function(done) {
        mock.seedCreate(apiTest.model.user, keys,
            data.seedUsers, 101)
          .then(function(users) {
            userData = users;
            usersId = _.pluck(users, '_id');
            done();
          }).catch(function(err) {
            console.log('Error mocking users', err);
            return;
          });
      });

      describe('Persisting users to the database\n', function() {
        it('- Should persist a valid userdata to database',
          function(done) {
            var userdata = mock.parseData(keys, data.testUsers.tuser1);
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(201)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                testuser = response.data;
                assert.equal(response.message, 'Created new Users');
                assert.equal(response.data.username + ' ' +
                  response.data.email, 'HAhmed hahmed@project.com');
                done();
              });
          });

        it('- Should throw validation error for duplicate data: ' +
          'username',
          function(done) {
            var userdata = mock.parseData(keys, data.testUsers.tuser1);
            userdata.username = 'HAhmed123';
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(409)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Users already exist \n ' +
                  'Change unique data');
                done();
              });
          });

        it('- Should throw validation error for duplicate data: ' +
          'email',
          function(done) {
            var userdata = mock.parseData(keys, data.testUsers.tuser1);
            userdata.email = 'hahmed123@project.com';
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(409)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Users already exist \n ' +
                  'Change unique data');
                done();
              });
          });
      });

      describe('Persisting Incomplete userdata', function() {
        /* check email, username, firstname, passsword, empty or
        invalid role*/
        it('- Should throw error for invalid userdata: ' +
          'firstname',
          function(done) {
            var userdata = mock.parseData(keys,
              data.invalidData);
            delete userdata['name.first'];
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.error.errors);
                assert.equal(response.error.message, 'Users validation failed');
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
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.error.errors);
                assert.equal(response.error.message, 'Users validation failed');
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
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.error.errors);
                assert.equal(response.error.message, 'Users validation failed');
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
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.error.errors);
                assert.equal(response.error.message, 'Users validation failed');
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
            agent
              .post('/api/users')
              .type('json')
              .send(userdata)
              .expect(400)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                var invalid = _.keys(response.error.errors);
                assert.equal(response.error.message, 'Users validation failed');
                assert.deepEqual(invalid, [keys[4]]);
                done();
              });
          });

      });

      describe('Persisted users\n', function() {
        var username = 'HAhmed',
          password = 'hahmed';

        var groupKeys = ['title', 'description', 'passphrase'];

        // seed groups 
        before(function(done) {
          mock.seedCreate(apiTest.model.group, groupKeys,
              groupSeed.seedGroups, 114)
            .then(function(groups) {
              seedGroupdata = groups;
              groupIds = _.pluck(groups, '_id');
              // update users with group id
              userData = _.map(userData, (a, index) => {
                a.groupId.push(groupIds[index % 2]);
                return a;
              });
              // mock updated user data
              mock.seedUpdate(apiTest.model.user, userData)
                .then(function(updated) {
                  userData = updated;
                  done();
                })
                .catch(function(err) {
                  console.log('Error updating users', err);
                });
            }).catch(function(err) {
              console.log('Error mocking groups', err);
              return;
            });
        });


        // users should be logged in before crud
        it('Should require a login/access_token for' +
          ' retrieve or update',
          function(done) {
            agent
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
            agent
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
            agent
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
          agent
            .post('/api/users/login')
            .type('json')
            .send({
              username: userData[0].username,
              password: data.seedUsers.user1[3]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              token = response.token;
              assert(response.token, 'Token not generated');
              assert.equal(typeof response.expires, 'number');
              assert.equal(response.user.username, 'DAdams');
              done();
            });
        });

        // retrieve any user data
        it('- Should retrieve any user data in group', function(done) {
          agent
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
              assert.equal(response.message, 'Users data:');
              assert.equal(usersId[2], response.data._id);
              done();
            });
        });


        // should return not exist for invalid user
        it('- Should not find invalid users', function(done) {
          agent
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
              assert.equal(response.message, 'Users(s) do(es) not exist');
              assert.equal(0, response.data.length, 'Userdata was retrieved');
              done();
            });
        });

        // should be able to retrieve all user data
        it('- Should be able to retrieve all' +
          ' user data in group',
          function(done) {
            agent
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
                assert.equal(response.message, 'Existing Users');
                assert.deepEqual(_.pluck(response.data,
                  '_id'), [101, 103, 105]);
                done();
              });
          });

        // should be able to retrieve all group
        it('- Should be able to retrieve all group',
          function(done) {
            agent
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
                assert.equal(response.message, 'Existing Groups');
                assert.deepEqual(_.pluck(response.data,
                  '_id'), [113, 114, 115]);
                done();
              });
          });

        // should be able to retrieve a group
        it('- Should be able to retrieve a group',
          function(done) {
            agent
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
                assert.equal(response.message, 'Groups data:');
                assert.deepEqual(response.data._id, 114);
                done();
              });
          });

        // update own user data
        it('- Should be able to update own data', function(done) {
          var userdata = mock.parseData(keys, data.testUsers.PM);
          userdata.username = 'DAdams_Love';
          agent
            .put('/api/users/' + usersId[0])
            .set({
              access_token: token,
            })
            .type('json')
            .send(userdata)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Updated Users');
              assert.equal(response.data.username, 'DAdams_Love');
              userData[0].username = response.data.username;
              done();
            });
        });

        it('- Should be able to join a group', function(done) {
          seedGroupdata[1].users.push(usersId[0]);
          agent
            .put('/api/groups/' + groupIds[1])
            .set({
              access_token: token,
              userid: usersId[0]
            })
            .type('json')
            .send({
              users: seedGroupdata[1].users,
              passphrase: groupSeed.seedGroups.group2[2]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.message, 'Updated Groups');
              assert.deepEqual(response.data.users, [101]);
              done();
            });
        });

        // should not be able to delete own userdata
        it('- Should not be able to delete own data', function(done) {
          agent
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
              assert.equal(response.message, 'Not authorized');
              assert.equal(response.error, 'Unauthorized user');
              done();
            });
        });


        // should not be able to delete other user data
        it('- Should not be able to delete other users data', function(done) {
          agent
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

          agent
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
