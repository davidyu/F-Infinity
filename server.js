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
        console.log( "added a player ");
        this.numPlayers++;
        var pid = this.joined[0];
        this.joined[0]++;
        S.addPlayer( pid );
        this.playerLookupTable[ id ] = { game: 0, gamePlayerIndex: pid };
        socket.emit( "setup", { d : pid });
    },

    removePlayer: function( id ) {
        S.removePlayer(playerLookupTable[ id ].gamePlayerIndex);
    },

    hasRoom: function() {
        return this.numPlayers < MAX_PLAYERS
    }
}

module.exports = {
    Server: Server
}