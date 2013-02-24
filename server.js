S = {};

var MAX_PLAYERS = 2; //soft cap

var Server = {

    playerLookupTable: {},
    numPlayers: 0,
    joined: [],

    init: function( Settings ) {
        S = Settings;
        this.joined = [ 0 ];
        this.numPlayers = 0;
        this.playerLookupTable  = {};
    },

    sendPositions: function( socket, pid ) {
        var msg = {
            position: S.players[ pid ].position,
        }

        console.log( "broadcasting position" );
        socket.emit( 'positionchange', msg );
    },

    addPlayer: function( socket, id ) {
        this.numPlayers++;
        var pid = this.joined[0];
        this.joined[0]++;
        S.addPlayer( pid );
        this.playerLookupTable[ id ] = { game: 0, gamePlayerIndex: pid };
        socket.emit( "setup", { d : pid });
        console.log( "added player " + id );
    },

    removePlayer: function( id ) {
        S.removePlayer( this.playerLookupTable[ id ].gamePlayerIndex );
        console.log( "removed player " + id );
    },

    hasRoom: function() {
        return this.numPlayers < MAX_PLAYERS
    }
}

module.exports = {
    Server: Server
}