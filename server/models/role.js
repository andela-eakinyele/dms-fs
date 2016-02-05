(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var roleSchema = new Schema({
    _id: {
      type: Number,
      min: 1,
      required: true,
      default: 1,
      unique: true
    },
    title: {
      type: String,
      required: (true, ' title is invalid')
    },
    users: [{
      type: Number,
      ref: 'Users'
    }],
    docs: [{
      type: Number,
      ref: 'Documents'
    }],
    groupId: [{
      type: Number,
      ref: 'Groups'
    }]
  });

  roleSchema.statics.getMaxId = function() {
    var query = this.find({}, '_id');
    return new Promise(function(resolve, reject) {
      query.exec(function(err, ids) {
        if (err) {
          reject(Error(err));
        }
        resolve(ids);
      });
    });
  };

  module.exports = mongoose.model('Roles', roleSchema);
})();
