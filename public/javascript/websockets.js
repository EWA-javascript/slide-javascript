/*!
 * client side websockets handler
 */

(function main($, window, undefined) {
    var socket = io.connect('http://' + window.location.hostname);
    var currentSlide = 0;

    $(document).bind('deck.change', function(event, from, to) {
        currentSlide = to;
        socket.emit('slide.change', { from: from, to: to });
      });

    socket.on('slide.change', function (data) {
        if (data.to !== currentSlide) {
          $.deck('go', data.to)
        }
      });

  }(jQuery, window));
