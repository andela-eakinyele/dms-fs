(function() {
  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var userSchema = new Schema({
    _id: {
      type: Number,
      min: 100,
      required: true,
      unique: true,
      default: 100
    },
    username: {
      type: String,
      required: (true, ' username is invalid')
    },
    name: {
      first: {
        type: String,
        required: (true, ' firstname is required')
      },
      last: {
        type: String,
        required: (true, ' lastname is required')
      }
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      message: 'Enter a valid email'
    },
    password: {
      type: String,
      required: true
    },
    roles: [{
      type: Number,
      ref: 'Roles'
    }],
    groupId: [{
      type: Number,
      ref: 'Groups'
    }],
    active: {
      type: Boolean,
      default: false
    }
  }, {
    strict: true
  });

  userSchema.statics.getMaxId = function() {
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

  module.exports = mongoose.model('Users', userSchema);
})();
