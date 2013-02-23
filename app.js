var app_port = 8080;

var app = require('http').createServer( handler );
var io = require('socket.io').listen(app);

function handler(req, res) {
    var message = 'TO INFINITY AND BEYOND<br/>that means it\'s working<br/>app_port:' + app_port;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end( message );
}

app.listen( app_port || 1337, null );

io.set('log level', 1);

/*io.sockets.on( 'connection', function( socket ) {

    //start listening for keydown events??

})*/