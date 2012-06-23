/*!
 * app.js is the server component of slippery
 *
 * @author pfleidi
 */

var Express = require('express');
var Log4js = require('log4js');
var Fs = require('fs');
var WebSocket = require('./lib/websocket.js');
var MemoryStore = Express.session.MemoryStore;
var sessionStore = new MemoryStore();

var PORT = 8080;
var LOGFILE = __dirname + '/log/slideshow.log';
var CONTROLLERS_FOLDER = __dirname + "/controllers/";
var logger = Log4js.getLogger('slideshow');

/*
 * set up the application
 */
var app = module.exports = Express.createServer();

app.configure(function () {
    app.use(Express.cookieParser());
    app.use(Express.session({
          store: sessionStore,
          key: 'slides.uid',
          secret: 'fljkasaskjfhdaskjf'
        }));

    app.use(Express.static(__dirname + '/public'));
    app.use(app.router);
  });

app.configure('development', function () {
    app.use(Express.errorHandler({
          dumpExceptions: true,
          showStack: true
        }));
    logger.setLevel('DEBUG');
  });

app.configure('production', function () {
    var accessLog = Fs.createWriteStream(__dirname + '/logs/access.log', {
        encoding: 'utf-8',
        flags: 'a'
      });

    app.use(Express.logger({ stream: accessLog }));
    app.use(Express.errorHandler());
    Log4js.addAppender(Log4js.fileAppender(LOGFILE));
    logger.setLevel('ERROR');
  });

var io = require('socket.io').listen(app);
WebSocket.handleSockets(io, logger, sessionStore);


  (function initControllers() {
      Fs.readdirSync(CONTROLLERS_FOLDER).forEach(function (file) {
          if (/\.js$/.test(file)) {
            require(CONTROLLERS_FOLDER + file).register(app);
          }
        });
    }());

app.listen(PORT, function () {
    logger.info('Server listening on port: http://localhost:' + PORT);
  });
