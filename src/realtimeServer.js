const { v4: uuid } = require('uuid');

module.exports = httpServer => {

    const { Server } = require('socket.io');

    const io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ["GET", "POST", "PUT"],
        }
    });

    let boardPlayers = [];
    let waitingRoom = {};

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

                setTimeout(() => {
                    const gameId = uuid();
                    io.to('lobby').emit('game-found', gameId)
                }, 3000)
            }
        });


        socket.on('accept-game', data => {
            if (!data.matchAccepted) {
                socket.broadcast.emit('decline-game', { data: false });
                return;
            }

            waitingRoom[data.gameId] = waitingRoom[data.gameId] || [];
            waitingRoom[data.gameId].push(data);
            socket.join(data.gameId)
            if (waitingRoom[data.gameId].length === 2) {
                io.in(data.gameId).emit('move to board', boardPlayers)
                io.to(data.gameId).emit('start-game', waitingRoom[data.gameId])
            }

        })

        socket.on('move', data => {
            io.to(data.gameID).emit('board', {
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
            console.log(data);
            boardPlayers = []
        });


    })
}