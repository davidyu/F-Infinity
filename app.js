var app_port = 8080;
var web_port = 80;

var PUSH_INTERVAL = 1000/10; //don't flood

//var server = require('http').createServer( handler );
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
    var message = 'TO INFINITY  AND BEYOND<br/>that means it\'s working<br/>app_port:' + app_port;
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end( message );
}

app.listen( app_port || 1337, null );
//server.listen( web_port || 1337, null );

io.set('log level', 1);

var alreadyInit = false;

io.sockets.on( 'connection', function( socket ) {

    if ( !alreadyInit ) {
        alreadyInit = true;
        Server.init( Settings );
        setInterval( function() { Server.sendPositions( socket ); }, PUSH_INTERVAL );
        Settings.init();
        Settings.me = -1;
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

        if ( Settings.players[ data.pid ] ) {
            Settings.players[ data.pid ].keyLeft = data.keyLeft;
            Settings.players[ data.pid ].keyRight = data.keyRight;
            Settings.players[ data.pid ].keyFaster = data.keyFaster;
            Settings.players[ data.pid ].keySlower = data.keySlower;
        }
    } );

    socket.on( 'message', function( message ) {
        if ( message == "inquire" && Server.hasRoom() ) {
            Server.addPlayer( socket, socket.handshake.address );
        } else {
            socket.send("no");
        }
    } );

    socket.on( 'disconnect', function( reason ) {
        Server.removePlayer( socket.handshake.address );
    } );

    /*
    socket.on( 'requestposition', function( data ) {

    } )*/
})