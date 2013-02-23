var http = require('http');
http.createServer(function (req, res) {
  var message = 'TO INFINITY AND BEYOND<br/>that means it\'s working<br/>app_port:' + process.env.VMC_APP_PORT;
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end( message );
}).listen(process.env.VMC_APP_PORT || 1337, null);

var io = require('socket.io').listen(http);

//io.set('log level', 1);

/*io.sockets.on( 'connection', function( socket ) {

    //start listening for keydown events??

})*/