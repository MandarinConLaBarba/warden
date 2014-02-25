"use strict";

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));
var Warden = require('./warden');
var net = require('net');
var spawn = require('child_process').spawn;
var _ = require('underscore');
var map = _.map;
var first = _.first;
var filter = _.filter;
var util = require('util');

var server = exports;

server.ensure = function (opts) {
  var warden = new Warden(opts);

  return warden
    .isRunning()
    .catch(function (error) {
      return spawnServer(warden);
    });
};

function spawnServer(warden) {
  return warden
    .init()
    .then(function () {
      var child = spawn(process.execPath, [module.filename, warden.prefix], {
        detached: true,
        stdio: 'ignore'
      });

      child.unref();
    });
}

function startServer(warden) {
    //Unclear to me why you are wrapping this but not utilizing the resolve, reject callbacks. Why use the Promise wrapper?
  return new Promise(function (resolve, reject) {
    var s = net.createServer();

    // TODO std* is lost, do something else
    s.on('error', console.error);

    s.on('close', function () {
      warden
        .cleanup()
        .then(function () {
          process.exit(0);
        });
    });

    s.on('connection', function (c) {
      c.on('data', function (data) {
        var lines = filter(data.toString().split('\n'), function (line) {
          return line.length > 0;
        });

        var commands = map(lines, JSON.parse);

        commands.forEach(function (command) {
          switch (command.action) {
          case 'marco':
            c.write('polo\n');
            break;
          case 'start':
            warden.start(c, command.argv);
            break;
          case 'stop':
            warden.stop(c, command.argv);
            break;
          case 'restart':
            warden.restart(c, command.argv);
            break;
          case 'kill':
            warden.kill(c, command.argv);
            break;
          case 'list':
            warden.list(c, command.argv);
            break;
          case 'die':
            c.write('server exiting\n');
            s.close();
            break;
          default:
            var msg = util.format('unknown action: %s\n', command.action);
            c.write(JSON.stringify({error: msg}));
            break;
          }
        });
      });
    });

    s.listen(warden.socket, function () {
      // TODO std* is lost, do something else
      console.log('server up');
    });
  });
}


if (require.main === module) {
  var prefix = first(process.argv.slice(2));
  var warden = new Warden({prefix: prefix});

  fs.writeFileAsync(warden.pidFile, process.pid)
    .then(function () {
      return startServer(warden);
    })
    .catch(console.error);
}
