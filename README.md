Warden Service Wrapper
======================

Usage
-----

```
usage: warden action [options] [COMMAND [command-options]]

Start "command" under warden's supervision.

actions:
  start               start COMMAND as a daemon
  stop                stop the COMMAND daemon
  kill                send a kill signal to the COMMAND daemon
  restart             restart the COMMAND daemon
  list                list processes under warden's supervision
  die                 kill the warden server if it's running

options:
  -s, --service       service identifier
  -p, --prefix        prefix directory for warden's runtime files
  -k, --signal        signal to use for the kill action [default: SIGHUP]
  -h, --help          show this text
```


Design Notes
------------

### client server

Listens on a unix socket

bin/warden starts a new server if none is running for this service

### Config and runtime files

```
file       /var/run/warden/pid
socket     /var/run/warden/sock=
directory  /var/run/warden/services
directory  /var/run/warden/cache

directory  /etc/warden
```

or some local prefix, configurable

```
./run/pid
./run/sock=
./run/services
./run/cache
./etc
```

### Functionality

* TODO Start a server
    * TODO Proper daemonize
* TODO Inject environment variables
    * TODO from Zookeeper
    * TODO from local files
* TODO Stop a server
* TODO Restart a server
* TODO Capture STDOUT and send
    * TODO to syslog
    * TODO to logstash
    * TODO to local files
