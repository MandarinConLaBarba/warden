Warden Service Wrapper
======================

Invocation
----------

```
$ warden --name myservice --manifest /path/to/manifest start
$ warden --name myservice --manifest /path/to/manifest stop
$ warden --name myservice --manifest /path/to/manifest restart
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
