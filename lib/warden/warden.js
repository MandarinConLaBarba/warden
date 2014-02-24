"use strict";

var Promise = require('bluebird');
var util = require('util');
var fs = Promise.promisifyAll(require('fs'));
var _ = require('underscore');
var map = _.map;
var partial = _.partial;
var filter = _.filter;
var first = _.first;
var net = require('net');
var mkdirp = Promise.promisify(require('mkdirp'));

module.exports = Warden;

function Warden(opts) {
  if (opts.prefix) {
    this.prefix = opts.prefix;

    this.socket = util.format('%s/run/warden.sock', opts.prefix);
    this.pidFile = util.format('%s/run/warden.pid', opts.prefix);
    this.servicesDir = util.format('%s/run/services', opts.prefix);
    this.cacheDir = util.format('%s/run/cache', opts.prefix);
    this.etcDir = util.format('%s/etc', opts.prefix);

    this.dirs = [
      util.format('%s/run/services', opts.prefix),
      util.format('%s/run/cache', opts.prefix),
      util.format('%s/etc', opts.prefix)
    ];
  } else {
    this.socket = '/var/run/warden/warden.sock';
    this.pidFile = '/var/run/warden/warden.pid';
    this.servicesDir = '/var/run/warden/services';
    this.cacheDir = '/var/run/warden/cache';
    this.etcDir = '/etc/warden';

    this.dirs = [
      '/var/run/warden/services',
      '/var/run/warden/cache',
      '/etc/warden'
    ];
  }
}

Warden.prototype.isRunning = function () {
  return Promise.bind(this)
    .then(filesExist)
    .then(pingServer)
    .catch(cleanup);
};

Warden.prototype.cleanup = cleanup;

/*
 * Always bind 'this'
 */

function cleanup() {
  /* jshint validthis:true */
  return Promise.all([
    fs.readFileAsync(this.pidFile).then(process.kill),
    fs.unlinkAsync(this.pidFile),
    fs.unlinkAsync(this.socket)
  ]);
}

/*
 * Always bind 'this'
 */

function filesExist() {
  /* jshint validthis:true */
  return Promise.all([
    fs.statAsync(this.pidFile)
      .then(function (stats) {
        if (!stats.isFile()) throw new Error();
      }),

    fs.statAsync(this.socket)
      .then(function (stats) {
        if (!stats.isSocket()) throw new Error();
      })
  ]);
}

/*
 * Always bind 'this'
 */

function pingServer() {
  /* jshint validthis:true */
  var self = this;

  return new Promise(function (resolve, reject) {
    var client = net.connect(self.socket);

    client.on('connect', function () {
      var message = JSON.stringify({action: 'marco'});
      client.write(message + '\n');
    });

    client.on('data', function (data) {
      if (data.toString().trim() === 'polo') {
        client.end();
        resolve(true);
      }
    });

    client.on('error', reject);

    client.setTimeout(1000, reject);
  });
}

Warden.prototype.init = function () {
  return Promise.bind(this)
    .then(initFs)
    .then(loadCurrentDb);
};

/*
 * Always bind 'this'
 */

function initFs() {
  /* jshint validthis:true */
  return Promise.all(map(this.dirs, function (dir) {
    return mkdirp(dir, 493)
      .catch(function (error) {
        if (error.cause.code !== 'EEXIST') throw error;
      });
  }));
}

/*
 * Always bind 'this'
 */

function loadCurrentDb() {
  /* jshint validthis:true */
  return fs.readdirAsync(this.servicesDir)
    .then(function (files) {
      var manifests = filter(files, function (f) { return /.*\.manifest$/.test(f); });
      return Promise.all(map(manifests, fs.readFileAsync));
    })
    .then(function (manifests) {
      return Promise.resolve(map(manifests, JSON.parse));
    })
    .bind(this)
    .then(function (manifests) {
      this.serviceDb = manifests;
    });
}

function notImplemented(c, argv) {
  c.write(JSON.stringify({error: first(argv._) + ' not implemented'}) + '\n');
}

Warden.prototype.start = notImplemented;
Warden.prototype.stop = notImplemented;
Warden.prototype.restart = notImplemented;
Warden.prototype.kill = notImplemented;
Warden.prototype.list = notImplemented;
