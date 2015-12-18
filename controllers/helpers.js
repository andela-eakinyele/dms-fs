var _ = require("lodash");

// generate objec data for create and update
exports.parseData = function (keys, _data) {
  return _.zipObject(keys, _data);
};

var getNextId = function (qresult) {
  var maxId = _.max(qresult.map(function (value) {
    return value._id;
  }));
  return parseInt(maxId) + 1;
};
exports.getNextId = getNextId;

var dberrors = function (reject, dbaction, err) {
  reject({
    "status": false,
    "message": "Error " + dbaction,
    "error": err
  });
};
exports.dberrors = dberrors;

var notExist = function (modelName, data, resolve) {
  resolve({
    "status": false,
    "message": modelName + "(s) do(es) not exist",
    "data": ""
  });
};
exports.notExist = notExist;


// g create method
exports.gCreate = function (modelName, modelData, model, findQuery) {
  var query = findQuery;
  return new Promise(function (resolve, reject) {
    // fetch maximum id from collection and increment by 1
    model.getMaxId().then(function (data) {
      if (data.length) {
        modelData._id = getNextId(data);
      }
      // exceute existing document query 
      query.then(function (rstfind) {
        // if no document exists
        if (!rstfind.length) {
          // create document
          model.create(modelData).then(function (rstcreate) {
            resolve({
              "status": true,
              "message": "Created new " + modelName,
              "data": rstcreate
            });
          }, function (err) { // db error
            dberrors(reject, "creating " + modelData.title + " " +
              modelName, err);
          });
        } else { // document exists
          var msg = modelName + " already exist \n Change unique data";
          resolve({
            "status": false,
            "message": msg,
            "data": ""
          });
        }
      }, function (err) { // db error
        dberrors(reject, "querying database", err);
      });
    }).catch(function (err) {
      dberrors(reject, "querying database", err);
    });
  });
};

// g getAll
exports.gGetAll = function (modelName, query) {
  return new Promise(function (resolve, reject) {
    query.then(function (rstGet) {
        if (rstGet.length) {
          resolve({
            "status": true,
            "message": "Existing " + modelName,
            "data": rstGet
          });
        } else {
          notExist(modelName, rstGet, resolve);
        }
      },
      function (err) { // db error
        // console.log("Error querying database");
        dberrors(reject, "querying database", err);
      });
  });
};

// g getOne
exports.gGetOne = function (modelName, query, id) {
  return new Promise(function (resolve, reject) {
    if (id === undefined) {
      resolve({
        "status": false,
        "message": "Get parameter not specified",
        "data": ""
      });
    }
    query.then(function (rstGetOne) {
      if (rstGetOne) {
        resolve({
          "status": true,
          "message": modelName + " data:",
          "data": rstGetOne
        });
      } else {
        notExist(modelName, id, resolve);
      }
    }, function (err) {
      dberrors(reject, "querying database", err);
    });
  });
};

// g Update document
exports.gUpdate = function (modelName, id, query) {
  return new Promise(function (resolve, reject) {
    if (id === undefined) {
      resolve({
        "status": false,
        "message": "Get parameter not specified",
        "data": ""
      });
      return;
    }
    query.then(function (rstUpdate) {
        if (rstUpdate) {
          resolve({
            "status": true,
            "message": "Updated " + modelName,
            "data": rstUpdate
          });
        } else {
          notExist(modelName, id, resolve);
        }
      },
      function (err) {
        dberrors(reject, "querying database", err);
      });
  });
};

// g delete document
exports.gDelete = function (modelName, query, id) {
  return new Promise(function (resolve, reject) {
    if (id === undefined) {
      resolve({
        "status": false,
        "message": "Get parameter not specified",
        "data": ""
      });
    }
    query.then(function (rstDel) {
        if (rstDel) {
          resolve({
            "status": true,
            "message": "Removed " + modelName,
            "data": rstDel
          });
        } else {
          notExist(modelName, id, resolve);
        }
      },
      function (err) { // db error
        dberrors(reject, "querying database", err);
      });
  });
};

// g find
exports.gFind = function (modelName, findQuery) {
  return new Promise(function (resolve, reject) {
    findQuery.then(function (rstFind) {
      if (rstFind) {
        resolve(rstFind);
      } else {
        resolve(false);
      }
    }, function (err) { // db error
      dberrors(reject, "querying database", err);
    });
  });
};