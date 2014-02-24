"use strict";

var parseArgs = require('minimist');
var _ = require('underscore');
var first = _.first;
var rest = _.rest;
var warden = require('../warden');
var util = require('util');

var cli = exports;

var help = [
  'usage: warden action [options] [COMMAND [command-options]]',
  '',
  'Start "command" under warden\'s supervision.',
  '',
  'actions:',
  '  start               start COMMAND as a daemon',
  '  stop                stop the COMMAND daemon',
  '  kill                send a kill signal to the COMMAND daemon',
  '  restart             restart the COMMAND daemon',
  '  list                list processes under warden\'s supervision',
  '  die                 kill the warden server if it\'s running',
  '',
  'options:',
  '  -s, --service       service identifier',
  '  -p, --prefix        prefix directory for warden\'s runtime files',
  '  -k, --signal        signal to use for the kill action [default: SIGHUP]',
  '  -h, --help          show this text'
];

function parseCL() {
  return parseArgs(process.argv.slice(2), {
    alias: {
      s: 'service',
      p: 'prefix',
      k: ['signal', 'kill'],
      h: 'help'
    },
    default: {
      k: 'SIGHUP'
    }
  });
}

function showHelpAndDie(msg) {
  var exitCode = msg ? 1 : 0;
  var log = msg ? console.log : console.error;

  log(help.join('\n'));

  if (msg) {
    log();
    log(msg);
  }

  process.exit(exitCode);
}

function validateCL(argv) {
  var action = first(argv._);

  switch (action) {
  case 'start':
    break;
  case 'stop':
    showHelpAndDie('operation not yet supported');
    break;
  case 'kill':
    showHelpAndDie('operation not yet supported');
    break;
  case 'restart':
    showHelpAndDie('operation not yet supported');
    break;
  case 'list':
    showHelpAndDie('operation not yet supported');
    break;
  case 'die':
    break;
  default:
    showHelpAndDie('unknown action: ' + action);
  }

  if (!argv.s) {
    showHelpAndDie('Argument missing: -s or --service is required');
  }

  return true;
}

cli.start = function () {
  var argv = parseCL();

  if (argv.h) {
    showHelpAndDie();
  } else {
    validateCL(argv);
  }

  var message = {
    action: first(argv._),
    argv: argv
  };

  return warden
    .client({ prefix: argv.p })
    .then(function (client) {
      return client.send(message);
    })
    .then(function (response) {
      console.log(response.toString().trim());
    })
    .catch(showHelpAndDie);
};
