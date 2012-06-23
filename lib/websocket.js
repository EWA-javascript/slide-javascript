/*!
 * websocket.js
 *
 * @author pfleidi
 */

var Fs = require('fs');
var Sys = require('sys');
var Io = require('socket.io');
var MODULE_FOLDER = __dirname + "/modules/";

exports.createWebsocketServer = function (app, log) {

  var webSocketServer = Io.listen(app, {
      flashPolicyServer: false
    });

  webSocketServer.on('connection', function (socket) {
      socket.on('move slide', function (message) {

        });
    });

};
