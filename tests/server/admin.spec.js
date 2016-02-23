(function() {
  'use strict';
  var apiTest = require('./specVar')();
  var request = apiTest.request;
  var assert = require('assert');
  var _ = require('lodash');

  var admin = require('./../../server/config/secret.js')().testAd;
  var userSeed = apiTest.testdata.users;

  module.exports = function() {

    var token = '';
    var users = [];
    var ids = [];
    var groupAdmin = {
      'Accept': 'application/json',
      'username': userSeed.groupUsers.tuser2[2],
      'password': userSeed.groupUsers.tuser2[3]
    };

    // seed roles and users
    describe('Admin users CRUD users and documents\n', function() {

      // verify admin login
      it('- Should return a token on Successful login', function(done) {
        request
          .post('/api/users/login')
          .type('json')
          .send(groupAdmin)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            token = response.data;
            assert(response.data.token, 'Token not generated');
            assert.equal(typeof response.data.expires, 'number');
            assert.equal(response.data.user.username, 'EAbbott');
            done();
          });
      });

      // should be able to retrieve all user data
      it('- Should be able to retrieve all user data in a group',
        function(done) {
          request
            .get('/api/users/')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              users = response;
              var name = _.pluck(response, 'username').slice(0, 4);
              ids = _.pluck(response, '_id');
              assert.deepEqual(name, ['EAbbott', 'PNishi',
                'SPolls'
              ]);
              done();
            });
        });

      it('- Should not be able to update other users data', function(done) {
        var userdata = users[1];
        userdata.username = 'Altered username';

        request
          .put('/api/users/' + ids[1])
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .type('json')
          .send(userdata)
          .expect('Content-Type', /json/)
          .expect(403)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Not authorized to update user');
            done();
          });
      });


      // should not be able to delete userdata
      it('- Should not be able to delete userdata', function(done) {
        request
          .delete('/api/users/' + ids[1])
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .type('json')
          .expect('Content-Type', /json/)
          .expect(403)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.message, 'Not authorized');
            done();
          });
      });

      // documents should be retrievable by pagination -page 1
      it('- Should be able to get all document' +
        ' by pages -page 1',
        function(done) {
          request
            .get('/api/documents')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            })
            .query({
              page: 1,
              limit: 2
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              var docIds = _.pluck(response, '_id');
              assert.deepEqual(docIds, [100, 102]);
              done();
            });
        });

      // documents should be retrievable by pagination - page 2
      it('- Should be able to get all document ' +
        ' by pages- page2',
        function(done) {
          request
            .get('/api/documents')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            })
            .query({
              page: 2,
              limit: 2
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              var docIds = _.pluck(response, '_id');
              assert.deepEqual(docIds, [103]);
              done();
            });
        });


      //  should be able to get all documents
      it('- Should be able to get all document', function(done) {
        request
          .get('/api/documents')
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            var docIds = _.pluck(response, '_id');
            assert.deepEqual(docIds, [100, 102, 103]);
            done();
          });
      });

      //  should be able to count of all documents
      it('- Should be able to get count of all document', function(done) {
        request
          .get('/api/documents')
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            var docIds = _.pluck(response, '_id');
            assert.deepEqual(docIds, [100, 102, 103]);
            done();
          });
      });

      it('- Should be able to get document by role', function(done) {
        request
          .get('/api/roles/3/documents')
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            var docbyroleIds = _.pluck(response, '_id');
            assert.deepEqual(docbyroleIds, [100, 102, 103]);
            done();
          });
      });

      it('- Should be able to get document by' +
        ' role in pages',
        function(done) {
          request
            .get('/api/roles/3/documents')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            }).query({
              limit: 2,
              page: 2
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              var docbyroleIds = _.pluck(response, '_id');
              assert.deepEqual(docbyroleIds, [103]);
              done();
            });
        });

      it('- Should be able to get document count by role', function(done) {
        request
          .get('/api/roles/3/documents/count')
          .set({
            'Accept': 'application/json',
            'username': userSeed.groupUsers.tuser2[2],
            'password': userSeed.groupUsers.tuser2[3],
            groupid: 113,
            userid: token.user._id,
            access_token: token.token
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response, 3);
            done();
          });
      });


      // should be able to retrieve all user data
      it('- Should be able to create roles in a group',
        function(done) {
          request
            .post('/api/roles/')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            })
            .send([{
              title: 'Publishers'
            }])
            .type('json')
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.ops[0].title, 'Publishers');
              done();
            });
        });


      it('- Super Admin Should be able to update' +
        ' other users data',
        function(done) {
          var userdata = users[1];
          delete userdata._id;
          userdata.username = 'Altered username';
          request
            .put('/api/users/' + ids[1])
            .set({
              'Accept': 'application/json',
              'username': admin.user,
              'password': admin.pw,
              userid: 100,
              access_token: token.token
            })
            .type('json')
            .send(userdata)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response.username, 'Altered username');
              done();
            });
        });

      // should be able to retrieve all user data
      it('- Should be able to retrieve all user data' +
        ' in a group in pages',
        function(done) {
          request
            .get('/api/users/')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            }).query({
              limit: 2,
              page: 2
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              users = response;
              var name = _.pluck(response, 'username').slice(0, 4);
              assert.deepEqual(name, ['SPolls']);
              done();
            });
        });

      // should be able to retrieve all user data in a group
      it('- Should be able to retrieve count of all user data' +
        ' in a group',
        function(done) {
          request
            .get('/api/usercount')
            .set({
              'Accept': 'application/json',
              'username': userSeed.groupUsers.tuser2[2],
              'password': userSeed.groupUsers.tuser2[3],
              groupid: 113,
              userid: token.user._id,
              access_token: token.token
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              assert.equal(null, err, 'Error encountered');
              var response = res.body;
              assert.equal(response, 3);
              done();
            });
        });

      // should be able to delete userdata
      it('- Super Admin Should  be able to delete userdata', function(done) {
        request
          .delete('/api/users/' + ids[1])
          .set({
            'Accept': 'application/json',
            'username': admin.user,
            'password': admin.pw,
            userid: 100,
            access_token: token.token
          })
          .type('json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            assert.equal(null, err, 'Error encountered');
            var response = res.body;
            assert.equal(response.success, true);
            done();
          });
      });

      // should be able to delete all document
      it('- Super Admin Should  be able to ' +
        'delete all documents',
        function(done) {
          request
            .delete('/api/documents/bulkdelete')
            .set({
              'Accept': 'application/json',
              'username': admin.user,
              'password': admin.pw,
              userid: 100,
              access_token: token.token
            })
            .query({
              ids: '101, 102, 103, 104, 105'
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err) {
              assert.equal(null, err, 'Error encountered');
              done();
            });
        });

      // should be able to view all document
      it('- Super Admin Should  be able to ' +
        'view all documents',
        function(done) {
          request
            .get('/api/documents/bulkview')
            .set({
              'Accept': 'application/json',
              'username': admin.user,
              'password': admin.pw,
              userid: 100,
              access_token: token.token
            })
            .query({
              ids: '101, 102, 103, 104, 105'
            })
            .type('json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err) {
              assert.equal(null, err, 'Error encountered');
              done();
            });
        });

    });

  };
})();
