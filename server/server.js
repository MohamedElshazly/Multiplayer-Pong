
const io = require('socket.io')(); 
const { initGame, gameLoop } = require('./game');
const { makeid } = require('./utils');

const states = {}; 
const clientRooms = {};

io.on('connection', (client) => {
    
    //listen to key presses 
    client.on('keydown', keyDownHandler);
    client.on('keyup', keyUpHandler);
    client.on('newGame', newGameHandler);
    client.on('joinGame', joinGameHandler); 
    
    function joinGameHandler(roomName) {
        const room = io.sockets.adapter.rooms[roomName]; 

        let allUsers; 
        if(room) {
            allUsers = room.sockets; 
        }
        let numClients = 0; 
        if(allUsers) {
            numClients = Object.keys(allUsers).length; 
        }

        if(numClients === 0) {
            client.emit('unknownGame'); 
            return;
        }
        else if(numClients > 1) { 
            client.emit('tooManyPlayers');
            return; 
        }

        clientRooms[client.id] = roomName; 
        client.join(roomName); 
        client.number = 2; 
        client.emit('init', 2); 
        
        startGameInterval(roomName);
    }

    function newGameHandler() {
        let roomName = makeid(5); 
        clientRooms[client.id] = roomName;
        client.emit('gameCode', roomName);

        states[roomName] = initGame();
        
        client.join(roomName); 
        client.number = 1; 
        client.emit('init', 1);
    }

    function keyDownHandler(e) {
        if(!states[clientRooms[client.id]])
        {
            return;
        }
        else if(e === 'ArrowUp') {
            states[clientRooms[client.id]].players[client.number - 1].upKeyPressed = true; 
        }
        else if(e === 'ArrowDown') {
            states[clientRooms[client.id]].players[client.number - 1].downKeyPressed = true; 
        }
    }

    function keyUpHandler(e) {
        if(!states[clientRooms[client.id]])
        {
            return;
        }
        else if(e === 'ArrowUp') {
            states[clientRooms[client.id]].players[client.number - 1].upKeyPressed = false; 
        }
        else if(e === 'ArrowDown') {
            states[clientRooms[client.id]].players[client.number - 1].downKeyPressed = false; 
        }
    }

}); 


function startGameInterval(roomName) {
    const intervalId = setInterval(() => {
        const winner = gameLoop(states[roomName]);
        if(!winner) {
            emitGameState(roomName, states[roomName]);
        } 
        else {
            emitGameOver(roomName, winner);
            states[roomName] = null;
            clearInterval(intervalId);
        }
    }, 1000/60);  
}

function emitGameState(room, state) {
    io.sockets.in(room).emit('gameState', JSON.stringify(state));
}

function emitGameOver(room, winner) {
    io.sockets.in(room).emit('gameOver', JSON.stringify({ winner }));
}

io.listen(3000);