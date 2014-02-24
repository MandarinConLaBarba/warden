"use strict";

var Warden = require('./warden');
var Promise = require('bluebird');
var net = require('net');

module.exports = Client;

function Client(opts) {
  this.warden = new Warden(opts);
}

Client.prototype.send = function (message) {
  var self = this;

  if (! /String/.test(Object.prototype.toString.call(message))) {
    message = JSON.stringify(message);
  }

  return new Promise(function (resolve, reject) {
    self.socket = net.connect(self.warden.socket);

    self.socket.on('connect', function () {
      self.socket.end(message + '\n');
    });

    self.socket.on('data', resolve);
    self.socket.on('error', reject);
  });
};
