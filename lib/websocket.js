/*!
 * websocket.js
 *
 * @author pfleidi
 */

var Fs = require('fs');
var parseCookie = require('./utils').parseCookie;
var Session = require('connect').middleware.session.Session;

exports.handleSockets = function (io, log, store) {

  io.on('connection', function (socket) {
      var handshake = socket.handshake;
      var session = handshake.session;

      console.log('A socket with sessionID ' + handshake.sessionID + ' connected!');

      var intervalID = setInterval(function () {
          session.reload(function () { session.touch().save(); });
        }, 30 * 1000);

      socket.on('disconnect', function () {
          console.log('A socket with sessionID ' + handshake.sessionID + ' disconnected!');
          clearInterval(intervalID);
        });

      socket.on('slide.change', function (data) {
          if (session.is_admin) {
            socket.broadcast.emit('slide.change', data);
          }
        });
    });

  // Autorize WebSocket
  io.set('authorization', function (data, accept) {
      if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['slides.uid'];
        data.sessionStore = store;

        store.get(data.sessionID, function (err, session) {
            if (err || !session) {
              accept('Error', false);
            } else {
              data.session = new Session(data, session);
              accept(null, true);
            }
          });
      } else {
        return accept('No cookie transmitted.', false);
      }
      accept(null, true);
    });

};
