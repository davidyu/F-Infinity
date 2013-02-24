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

    sendPositions: function( socket ) {
        var msg = {
            position: S.position,
        }

        console.log( "broadcasting position" );
        socket.emit( 'positionchange', msg );
    },

    addPlayer: function( socket, id ) {
        console.log( "added a player ");
        this.numPlayers++;
        this.joined[0]++;
        S.addPlayer(this.joined[0]);
        this.playerLookupTable[ id ] = { game: 0, gamePlayerIndex: this.joined[0] };
        socket.emit( "setup", { d : this.joined[0] });
    },

    disconnect: function( id ) {
        S.removePlayer(playerLookupTable[ id ].gamePlayerIndex);
    },

    hasRoom: function() {
        return this.numPlayers < MAX_PLAYERS
    }
}

module.exports = {
    Server: Server
}