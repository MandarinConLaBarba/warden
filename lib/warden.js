"use strict";

var Promise = require('bluebird');
var server = require('./warden/server');
var Client = require('./warden/client');

var warden = exports;

warden.cli = require('./warden/cli');

warden.client = function (opts) {
  return new Promise(function (resolve, reject) {
    return server
      .ensure(opts)
      .then(function (running) {
        var delay = running ? 0 : 1000;

        return Promise.delay(delay)
          .then(function () {
            resolve(new Client(opts));
          });
      })
      .catch(reject);
  });
};
