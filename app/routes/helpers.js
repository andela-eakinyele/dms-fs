var _ = require("lodash");

exports.dberrors = function(res, dbaction, err) {
  res.status(500).json({
    "status": false,
    "message": "Error " + dbaction,
    "error": err
  });
};

exports.parseReq = function(keys, body) {
  return _.map(keys, function(value) {
    return body[value];
  });
};