var app_port = 8080;

var app = require('http').createServer( handler );
var io = require('socket.io').listen(app);

require( "./constants" );
var u = require( "./utils" );
var g = require( "./game" );
var s = require( "./server" );

var Util = u.Util;
var Game = g.Game;
var Settings = g.Settings;
var Server = s.Server;

function handler(req, res) {
    var message = 'TO INFINITY AND BEYOND<br/>that means it\'s working<br/>app_port:' + app_port;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end( message );
}

app.listen( app_port || 1337, null );

io.set('log level', 1);

var alreadyInit = false;

io.sockets.on( 'connection', function( socket ) {

    if ( !alreadyInit ) {
        alreadyInit = true;
        Server.init( Settings );
        Settings.init();
        Game.run( Util, null, //pass modules
                  { canvas: null, //don't need to render
                   render: null,
                   update: Game.update,
                   step: Settings.step,
                   images: [],
                   client: false,
                   ready: function( images ) {
                      //do nothing
                      Settings.reset();
                   }
        } );   
    }

    socket.on( 'keystatechange', function( data ) {
        Settings.keyLeft = data.keyLeft;
        Settings.keyRight = data.keyRight;
        Settings.keyFaster = data.keyFaster;
        Settings.keySlower = data.keySlower;
        Server.sendPositions( socket ); //broadcast
    });

    /*
    socket.on( 'requestposition', function( data ) {

    } )*/
})