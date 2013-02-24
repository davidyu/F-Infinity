S = {};

var MAX_PLAYERS = 8; //soft cap

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

    sendPositions: function( socket ) {
        var msg = {}

        msg.players = [];

        for ( i = 0; i < S.players.length; i++ ) {
            if ( !S.players[i] ) {
                continue;
            }

            msg.players[i] = {};

            msg.players[i].position = S.players[i].position;
            msg.players[i].speed = S.players[i].speed;
            msg.players[i].X = S.players[i].X;
        }
        
        socket.emit( 'positionchange', msg );
        socket.broadcast.emit( 'positionchange', msg );
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
        console.log( this.playerLookupTable );
        if ( this.playerLookupTable[ id ] ) {
            S.removePlayer( this.playerLookupTable[ id ].gamePlayerIndex );
            this.joined[0]--;
            this.numPlayers--;
            console.log( "removed player " + id );
        } else {
            console.log( "tried to remove but no record exists for player." );
        }
        
    },

    hasRoom: function() {
        return this.numPlayers < MAX_PLAYERS
    }
}

module.exports = {
    Server: Server
}