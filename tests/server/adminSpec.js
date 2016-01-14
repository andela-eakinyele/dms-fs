(function() {
  'use strict';
  var apiTest = require('./specMod');
  var agent = apiTest.agent;
  var assert = require('assert');
  var _ = require('lodash');
  var mock = apiTest.seed;
  var data = apiTest.testdata;
  var uKeys = ['firstname', 'lastname', 'username', 'password',
    'role', 'email'
  ];
  var docKeys = ['username', 'documentName', 'title', 'content', 'role'];

  module.exports = function() {
    // seed roles and users
    describe('Admin users CRUD users and documents\n', function() {
      var token = '';
      var newUsers = [];
      var docIds = [];
      var user = {
        username: 'EAbbott',
        password: 'eabbott'
      };
      describe('Persisting admin and non-admin users\n' +
        ' to the database',
        function() {
          // verify admin login
          it('- Should return a token on Successful login', function(done) {
            agent
              .post('/api/users/login')
              .type('json')
              .send(user)
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

          ['admin2', 'trainee'].forEach(function(key) {
            it('- Should persist a valid userdata to database:' +
              key,
              function(done) {
                var userdata = mock.parseData(uKeys, data.testUsers[key]);
                agent
                  .post('/api/users')
                  .set({
                    username: user.username,
                    access_token: token
                  })
                  .type('json')
                  .send(userdata)
                  .expect(201)
                  .end(function(err, res) {
                    assert.equal(null, err, 'Error encountered');
                    var response = res.body;
                    newUsers.push(response.data);
                    assert.equal(response.message, 'Created new Users');
                    assert.equal(response.data.username + ' ' +
                      response.data.email, userdata.username + ' ' +
                      userdata.email);
                    done();
                  });
              });
          });
        });

      describe('Retrieve all users, update and delete' +
        ' other users\n',
        function() {
          // should be able to retrieve all user data
          it('- Should be able to retrieve all user data' +
            ' at once',
            function(done) {
              agent
                .get('/api/users/')
                .set({
                  username: user.username,
                  access_token: token
                })
                .type('json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                  assert.equal(null, err, 'Error encountered');
                  var response = res.body;
                  var name = _.pluck(response.data, 'username').slice(0, 4);
                  assert.equal(response.message, 'Existing Users');
                  assert.deepEqual(name, ['EAbbott', 'DAdams', 'CRSalt',
                    'JCraig'
                  ]);
                  done();
                });
            });

          it('- Should be able to update other users data', function(done) {
            var userdata = {};
            userdata.role = 'Mid Dev';
            uKeys.forEach(function(key) {
              if (key !== 'role') {
                userdata[key] = newUsers[1][key];
              }
              if (key === 'firstname') {
                userdata[key] = newUsers[1].name.first;
              }
              if (key === 'lastname') {
                userdata[key] = newUsers[1].name.last;
              }
            });
            userdata.username = 'LLong';
            agent
              .put('/api/users/' + newUsers[1]._id)
              .set({
                username: user.username,
                access_token: token
              })
              .type('json')
              .send(userdata)
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Updated Users');
                assert.equal(response.data.username, 'LLong');
                done();
              });
          });
          // should be able to delete userdata
          it('- Should be able to delete userdata', function(done) {
            agent
              .delete('/api/users/' + newUsers[1]._id)
              .set({
                username: user.username,
                access_token: token
              })
              .type('json')
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Removed Users');
                assert.equal(response.data.username, 'LLong');
                done();
              });
          });
        });
      //  should be able to get, getall, update and delete all documents
      describe('Should be able to CRUD documents\n', function() {

        [100, 101, 102, 104, 105].forEach(function(key) {
          it('- Should be able to get all document', function(done) {
            agent
              .get('/api/documents/' + key)
              .set({
                username: user.username,
                access_token: token
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Documents data:');
                assert.deepEqual(response.data._id, key);
                done();
              });
          });
        });
        //  should be able to get all documents
        it('- Should be able to get all document at once', function(done) {
          agent
            .get('/api/documents')
            .set({
              username: user.username,
              access_token: token
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              docIds = _.pluck(response.data, '_id');
              assert.equal(response.message, 'Existing Documents');
              assert.deepEqual(docIds, [100, 101, 102, 104, 105]);
              done();
            });
        });

        it('- Should be able to get document by role', function(done) {
          //roleid 2 === Project Manager
          agent
            .get('/api/roles/2/documents')
            .set({
              username: user.username,
              access_token: token
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              var docbyroleIds = _.pluck(response.data, '_id');
              assert.equal(response.message, 'Document for role-2');
              assert.deepEqual(docbyroleIds, [100, 101, 102, 104]);
              done();
            });
        });

        it('- Should be able to get document by date', function(done) {
          agent
            .post('/api/documents/date')
            .set({
              username: user.username,
              access_token: token
            })
            .type('json')
            .send({
              'date': new Date().toDateString()
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              var docbydate = _.pluck(response.data, '_id');
              assert.equal(response.message, 'Document for ' +
                new Date().toDateString());
              assert.deepEqual(docbydate, [100, 101, 102, 104, 105]);
              done();
            });
        });

        ['doc3', 'doc5', 'doc6'].forEach(function(key, index) {
          // should be able to update all document data
          it('- Should be able to update all document', function(done) {
            var docdata = mock.parseData(docKeys, data.seedDocs[key]);
            var oldName = docdata.documentName;
            docdata.documentName = 'Dolor-' + oldName;
            agent
              .put('/api/documents/' + docIds[index + 2])
              .set({
                username: user.username,
                access_token: token
              })
              .send(docdata)
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Updated Documents');
                assert.equal(response.data.documentName, 'Dolor-' +
                  data.seedDocs[key][1]);
                done();
              });
          });
        });
        // should be able to delete all documents
        [100, 101, 102, 104, 105].forEach(function(key) {
          // should be able to update all document data
          it('- Should be able to delete all document', function(done) {
            agent
              .delete('/api/documents/' + key)
              .set({
                username: user.username,
                access_token: token
              })
              .expect('Content-Type', /json/)
              .expect(200)
              .end(function(err, res) {
                assert.equal(null, err, 'Error encountered');
                var response = res.body;
                assert.equal(response.message, 'Removed Documents');
                assert.equal(response.data._id, key);
                done();
              });
          });
        });
      });
    });
  };
})();
