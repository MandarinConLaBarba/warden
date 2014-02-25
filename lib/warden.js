"use strict";

var Promise = require('bluebird');
var server = require('./warden/server');
var Client = require('./warden/client');

var warden = exports;

warden.cli = require('./warden/cli');

warden.client = function (opts) {

    //Removed promise wrapper because the purpose wasn't obvious to me..if .ensure() fails, you can catch it further up the chain, no need to
    //use wrapper in this case I think?
    return server
      .ensure(opts)
      .then(function (running) {
        var delay = running ? 0 : 1000;

        return Promise.delay(delay)
          .then(function () {
            return new Client(opts);
          });
      });


};
