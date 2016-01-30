(function() {
  'use strict';
  var Doc = require('./../models/document');
  var User = require('./../models/user');
  var Role = require('./../models/role');
  var _ = require('lodash');

  var cMthds = require('./helpers');
  var docKeys = ['username', 'documentName', 'title', 'content',
    'role', 'projectTitle'
  ];
  var typeArray = ['txt', 'js', 'json', 'doc'];

  function getCmp(id, username, cb) {
    // query for document
    var queryDoc = Doc.findOne({
      _id: id
    });
    // query for user access
    var queryUser = User.findOne({
      username: username
    }).populate({
      path: 'role',
      select: 'title'
    });
    return new Promise(function(resolve, reject) {
      cMthds.gGetOne('Documents', queryDoc, id)
        .then(function(docs) {
          cMthds.gGetOne('Users', queryUser, '')
            .then(function(users) {
              if (docs.status !== 400) {
                // find matching role for user and document
                var userRoles = users.data.role;
                var docRoles = docs.data.role;
                var matchFind = userRoles.filter(function(value) {
                  return (docRoles.indexOf(value._id)) !== -1;
                });
                resolve(cb(matchFind, docs, users));
              } else {
                resolve(docs);
              }
            }).catch(function(errUser) {
              cMthds.dberrors(reject, 'querying database', errUser);
            });
        }).catch(function(errDoc) {
          cMthds.dberrors(reject, 'querying database', errDoc);
        });
    });
  }

  function checkRoleValidType(docName, docRole) {
    // validate document type
    var validType = typeArray.filter(function(type) {
      var regex = new RegExp('(\\.' + type + ')$');
      return regex.test(docName);
    });
    if (validType.length !== 1) {
      return {
        'status': 406,
        'message': 'Invalid file type',
        'data': []
      };
    }
    // verify array of roles 
    if (!docRole.length || typeof roles === 'string') {
      return {
        'status': 406,
        'message': 'No roles specified/Specify array of roles',
        'data': []
      };
    } else {
      return {
        'status': true
      };
    }
  }

  var docFunctions = {
    createDocument: function(_docData) {
      // parse form data to object
      var docData = cMthds.parseData(docKeys, _docData);
      // query for existing document
      var query = Doc.find({}).or([{
        title: docData.title
      }, {
        documentName: docData.documentName
      }]);
      return new Promise(function(resolve, reject) {
        var roles = docData.role;
        var checked = checkRoleValidType(docData.documentName, roles);
        // role is an array
        if (checked.status !== true) {
          resolve(checked);
          return;
        } else {
          var addRoles = roles.concat(['Admin']);
          // get id of roles for populating document
          Role.find({}).where('title').in(addRoles).select('_id')
            .then(function(arrRoles) {
              if (arrRoles.length) {
                arrRoles = _.pluck(arrRoles, '_id');
                // get user id to assign to document
                User.findOne()
                  .where('username').equals(docData.username)
                  .where('role').in(arrRoles)
                  .select('_id').then(function(user) {
                      if (user) {
                        docData.ownerId = user._id;
                        docData.role = arrRoles;
                        resolve(cMthds
                          .gCreate('Documents', docData, Doc, query));
                      } else {
                        // Invalid user
                        resolve({
                          'status': 406,
                          'message': 'Invalid User/Role specified \'' +
                            docData.username + '/' + docData.role +
                            '\' does not exist',
                          'data': []
                        });
                      }
                    },
                    function(err) { // db error
                      cMthds.dberrors(reject, 'querying database', err);
                    });
                // invalid roles
              } else {
                resolve({
                  'status': 406,
                  'message': 'Invalid Roles specified \'' +
                    docData.roles + '\' does not exist',
                  'data': []
                });
              }
            }, function(err) { // db error
              cMthds.dberrors(reject, 'querying database', err);
            });
        }
      });
    },

    getAllDocuments: function(limit) {
      var query = Doc.find({}).populate({
        path: 'ownerId',
        select: 'username'
      }).populate({
        path: 'role',
        select: 'title'
      }).sort('dateCreated');
      if (limit) {
        query = query.limit(limit);
      }
      return cMthds.gGetAll('Documents', query);
    },

    getDocument: function(id, username) {
      return getCmp(id, username, function(matchFind, docs) {
        if (matchFind.length) {
          return docs;
        } else {
          return {
            'status': 403,
            'message': 'Not authorized to view document',
            'data': []
          };
        }
      });
    },

    updateDocument: function(_docData, id, username) {
      var docData = cMthds.parseData(docKeys, _docData);
      return getCmp(id, username, function(matchFind, docs) {
        // user role is included in document or role is admin
        if (matchFind.length) {
          docData.ownerId = docs.data.ownerId;
          var roles = docData.role;
          var checked = checkRoleValidType(docData.documentName, roles);
          // update role is not an array and doucmentName is invalid
          if (!checked.status) {
            return checked;
          } else {
            var addRoles = roles.concat(['Admin']);
            // get id of roles for populating document
            return new Promise(function(resolve, reject) {
              Role.find({}).where('title').in(addRoles).select('_id')
                .then(function(arrRoles) {
                    if (arrRoles.length >= docData.role.length) {
                      arrRoles = _.pluck(arrRoles, '_id');
                      docData.role = arrRoles;
                      docData.lastModified = Date.now();
                      // delete docData['username'];
                      var query = Doc.findByIdAndUpdate(id, docData, {
                        new: true
                      });
                      resolve(cMthds.gUpdate('Documents', id, query));
                    } else { // invalid roles in array
                      resolve({
                        'status': 406,
                        'message': 'Invalid roles specified \'' +
                          docData.role + '\' does not exist',
                        'data': []
                      });
                    }
                  },
                  function(err) { // db error
                    cMthds.dberrors(reject, 'querying database', err);
                  });
            });
          }
        } else {
          return {
            'status': 403,
            'message': 'Not authorized to edit document',
            'data': []
          };
        }
      });
    },

    getDocsByOwnerId: function(id) {
      var ownerId = id;
      return new Promise(function(resolve, reject) {
        Doc.getDocsByOwnerId(ownerId).then(function(data) {
          if (data.length) {
            resolve({
              'status': 200,
              'message': 'Document for id ' + id,
              'data': data
            });
          }
          resolve({
            'status': 200,
            'message': 'No Document exist for id ' + id,
            'data': []
          });
        }).catch(function(err) {
          cMthds.dberrors(reject, 'querying database', err);
        });
      });
    },

    getDocsByDate: function(date) {
      return new Promise(function(resolve, reject) {
        Doc.getDocsByDate(date).then(function(data) {
          if (data.length) {
            resolve({
              'status': 200,
              'message': 'Document for ' + date,
              'data': data
            });
          } else {
            resolve({
              'status': 200,
              'message': 'No Document exist for date ',
              'data': []
            });
          }
        }).catch(function(err) {
          cMthds.dberrors(reject, 'querying database', err);
        });
      });
    },

    deleteDocument: function(id, username) {
      return getCmp(id, username, function(matchFind, docs, users) {
        if ((docs.data.role.length === 2 && matchFind.length &&
            users.data._id === docs.data.ownerId[0]) ||
          _.pluck(users.data.role, 'title').indexOf('Admin') > -1) {
          var query = Doc.findByIdAndRemove(id);
          return cMthds.gDelete('Documents', query, id);
        } else {
          return {
            'status': 403,
            'message': 'Not authorized to delete document',
            'data': []
          };
        }
      });
    }
  };

  module.exports = docFunctions;
})();
