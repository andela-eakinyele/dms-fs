(function() {
  'use strict';
  var _ = require('lodash');

  var getNextId = function(qresult) {
    var maxId = _.max(qresult.map(function(value) {
      return value._id;
    }));
    return parseInt(maxId) + 1;
  };
  exports.getNextId = getNextId;

  var resdberrors = function(res, dbaction, err) {
    res.status(500).json({
      'status': false,
      'message': 'Error ' + dbaction,
      'error': err
    });
  };
  exports.resdberrors = resdberrors;

  var dberrors = function(cb, dbaction, err, code) {
    cb({
      'status': code,
      'message': 'Error ' + dbaction,
      'error': err
    });
  };
  exports.dberrors = dberrors;

  var notExist = function(modelName, data, resolve) {
    resolve({
      'status': 400,
      'message': modelName + '(s) do(es) not exist',
      'data': []
    });
  };
  exports.notExist = notExist;


  // g create method
  exports.gCreate = function(modelName, modelData, model, findQuery) {
    var query = findQuery;
    return new Promise(function(resolve, reject) {
      // fetch maximum id from collection and increment by 1
      model.getMaxId().then(function(data) {
        if (data.length) {
          modelData._id = getNextId(data);
        }
        // exceute existing document query 
        query.then(function(rstfind) {
          // if no document exists
          if (!rstfind.length) {
            // create document
            model.create(modelData).then(function(rstcreate) {
              if (modelName === 'Users') {
                rstcreate.password = null;
              }
              resolve({
                'status': 201,
                'message': 'Created new ' + modelName,
                'data': rstcreate
              });
            }, function(err) { // db error
              dberrors(reject, 'creating ' + modelData + ' ' +
                modelName, err, 400);
            });
          } else { // document exists
            var msg = modelName + ' already exist \n Change unique data';
            resolve({
              'status': 409,
              'message': msg,
              'data': []
            });
          }
        }, function(err) { // db error
          dberrors(reject, 'querying database', err, 500);
        });
      }).catch(function(err) {
        dberrors(reject, 'querying database', err, 500);
      });
    });
  };

  // g getAll
  exports.gGetAll = function(modelName, query) {
    return new Promise(function(resolve, reject) {
      query.then(function(rstGet) {
          if (rstGet.length) {
            resolve({
              'status': 200,
              'message': 'Existing ' + modelName,
              'data': rstGet
            });
          } else {
            resolve({
              'status': 200,
              'message': 'Existing ' + modelName,
              'data': []
            });
          }
        },
        function(err) { // db error
          dberrors(reject, 'querying database', err, 500);
        });
    });
  };

  // g getOne
  exports.gGetOne = function(modelName, query, id) {
    return new Promise(function(resolve, reject) {
      if (id === undefined) {
        resolve({
          'status': 400,
          'message': 'Get parameter not specified',
          'data': []
        });
      }
      query.then(function(rstGetOne) {
        if (rstGetOne) {
          resolve({
            'status': 200,
            'message': modelName + ' data:',
            'data': rstGetOne
          });
        } else {
          notExist(modelName, id, resolve);
        }
      }, function(err) {
        dberrors(reject, 'querying database', err, 500);
      });
    });
  };

  // g Update document
  exports.gUpdate = function(modelName, id, query) {
    return new Promise(function(resolve, reject) {
      if (id === undefined) {
        resolve({
          'status': 400,
          'message': 'Get parameter not specified',
          'data': []
        });
        return;
      }
      query.then(function(rstUpdate) {
          if (rstUpdate) {
            resolve({
              'status': 200,
              'message': 'Updated ' + modelName,
              'data': rstUpdate
            });
          } else {
            notExist(modelName, id, resolve);
          }
        },
        function(err) {
          dberrors(reject, 'querying database', err, 500);
        });
    });
  };

  // g delete document
  exports.gDelete = function(modelName, query, id) {
    return new Promise(function(resolve, reject) {
      if (id === undefined) {
        resolve({
          'status': 400,
          'message': 'Get parameter not specified',
          'data': []
        });
      }
      query.then(function(rstDel) {
          if (rstDel) {
            resolve({
              'status': 200,
              'message': 'Removed ' + modelName,
              'data': rstDel
            });
          } else {
            notExist(modelName, id, resolve);
          }
        },
        function(err) { // db error
          dberrors(reject, 'querying database', err, 500);
        });
    });
  };

  // g find
  exports.gFind = function(modelName, findQuery) {
    return new Promise(function(resolve, reject) {
      findQuery.then(function(rstFind) {
        if (rstFind) {
          resolve(rstFind);
        } else {
          resolve(false);
        }
      }, function(err) { // db error
        dberrors(reject, 'querying database', err, 500);
      });
    });
  };
})();
