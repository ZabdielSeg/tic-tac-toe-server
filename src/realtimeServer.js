const { loginUser } = require('./database/contollers/controllers');

module.exports = httpServer => {

    const { Server } = require('socket.io');

    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ["GET", "POST", "PUT"],
        }
    });

    let boardPlayers = [];

    io.on("connection", socket => {
        socket.emit('connectedUser', {
            userID: socket.id
        })

        const usersCounter = io.engine.clientsCount;

        socket.broadcast.emit('connected users', usersCounter)

        socket.on('join-lobby', (playerId) => {
            socket.join('lobby');
            boardPlayers.push(playerId.username)

            // Check if there are any other players in the lobby
            const lobby = io.sockets.adapter.rooms.get('lobby');
            const playerIds = lobby ? Array.from(lobby.keys()) : [];

            // If there are two players in the lobby, start a game between them
            if (playerIds.length > 1) {
                const gameId = '1234';
                io.to('lobby').emit('game-found', gameId)
            }
        });

        let someGameId = '';

        socket.on('accept-game', gameId => {
            someGameId = gameId
            socket.join(someGameId)
            io.to(someGameId).emit('start-game', boardPlayers)
        })

        socket.on('decline-game', data => {

        })

        socket.on('login', async data => {
            const userInfo = await loginUser(data)
            socket.emit('userInfo', {
                userData: userInfo,
                socketID: socket.id
            });
            socket.join('lobby')
        })

        socket.on('move', data => {
            io.to(someGameId).emit('board', {
                ...data,
                player: data.player === "X" ? "O" : "X",
                turn: data.turn == 0 ? 1 : 0,
                boardPlayers
            })
        });

        socket.on('message', (data) => {
            socket.broadcast.emit('message', {
                body: data,
                from: 'Your opponent'
            })
        });

        socket.on('disconnect', (data) => {
            boardPlayers = []
        });


    })
}