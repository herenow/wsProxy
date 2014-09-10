wsProxy
=======
[![Build Status](https://travis-ci.org/herenow/wsProxy.svg?branch=master)](https://travis-ci.org/herenow/wsProxy)

This is a websocket to tcp proxy, written in node.js. It is dynamic and will proxy to various tcp servers.


Installation
----------
```
npm install wsproxy -g
```


Usage
----------

```
wsproxy [-p PORT] [-t THREADS (# of threads to spawn)] [-s ENABLE_SSL] [-k KEY_FILE] [-c CERT_FILE]
```
* If no `port` is specified it will default to process.env.PORT or port 5999.
* Use `wsproxy --help` for a list of available commands.


Client usage
----------
When connecting to this websocket you will give it an IP:PORT uri, for example:
```
ws://websocket.example.com:5999/127.0.0.1:6900
```
* You can edit allowed.js to only allow proxy to certain IP:PORT
* We will soon release a version, with better standards for this.


Authors
---------
This was created for and by the roBrowser project.
- [vthibault](https://github.com/vthibault)
- [herenow](https://github.com/herenow)


Thank you
----------
- Einaros/ws for providing the websocket middleware
