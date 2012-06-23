/*!
 * app.js is the server component of slippery
 *
 * @author pfleidi
 */

var Express = require('express');
var Log4js = require('log4js');
var WebSocket = require('./lib/websocket.js');

var PORT = 8080;
var LOGFILE = __dirname + '/log/slideshow.log';
var logger = Log4js.getLogger('slideshow');

/*
 * set up the application
 */
var app = module.exports = Express.createServer();

app.configure(function () {
    app.use(app.router);
    app.use(Express.static(__dirname + '/public'));
    app.use(Express.cookieParser());
    app.use(Express.session({ secret: 'fljkasaskjfhdaskjf', key: 'js.presentation' }));
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

app.listen(PORT, function () {
    WebSocket.createWebsocketServer(app, logger);
    logger.info('Server listening on port: http://localhost:' + PORT);
  });
