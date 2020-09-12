const socket = io('http://localhost:3000');

//colors
const BG_COLOR = '#000'; 
const PADDLE_COLOR ='#fff'; 
const BALL_COLOR = '#fff';

//get canvas 
const gameScreen = document.getElementById('gameScreen'); 
const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d');
let playerNumber;

const initialScreen = document.getElementById('initialScreen'); 
const newGameButton = document.getElementById('newGameButton'); 
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

newGameButton.addEventListener('click', newGameHandler); 
joinGameButton.addEventListener('click', joinGameHandler); 

function newGameHandler() {
    socket.emit('newGame'); 
    init();
}

function joinGameHandler() {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code); 
    init();
}


//whenever we recieve a new game state from server we render it on the client 
socket.on('gameState', (gameState) => {
    gameState = JSON.parse(gameState); 
    requestAnimationFrame(() => draw(gameState));
});

socket.on('gameOver', (data) => {
    data = JSON.parse(data);
    if(data.winner === playerNumber) {
        alert('congratulations, you win...');
        document.location.reload();
    }
    else{
        alert('You lose...'); 
        document.location.reload();
    }
});

socket.on('gameCode', (code) => {
    gameCodeDisplay.innerText = code; 
});

socket.on('init', (number) => {
    playerNumber = number;
});

socket.on('unknownGame', () => {
    reset();
    alert('unknown game code...');  
});

socket.on('tooManyPlayers', () => {
    reset(); 
    alert('game already in progress');
});

function reset() {
    initialScreen.style.display = 'block'; 
    gameScreen.style.display = 'none'; 
    gameCodeInput.value = "";
    gameCodeDisplay.innerText = ""; 
    playerNumber = null; 
}


document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    socket.emit('keydown', e.key);
}

function keyUpHandler(e) {
    socket.emit('keyup', e.key);
}

function init() {
    initialScreen.style.display = 'none'; 
    gameScreen.style.display = 'block';

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = BG_COLOR; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function draw(state) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.fillStyle = BG_COLOR; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    let playerOne = state.players[0]; 
    let playerTwo = state.players[1]; 
    let ball = state.ball;

    //draw paddleOne and paddleTwo
    ctx.fillStyle = PADDLE_COLOR; 
    ctx.fillRect(playerOne.x, playerOne.y, playerOne.paddleWidth, playerOne.paddleHeight);
    
    ctx.fillStyle = PADDLE_COLOR; 
    ctx.fillRect(playerTwo.x, playerTwo.y, playerTwo.paddleWidth, playerTwo.paddleHeight);
    
    //draw ball 
    ctx.fillStyle = BALL_COLOR; 
    ctx.arc(ball.x, ball.y, ball.ballRadius, 0, Math.PI * 2);
    ctx.fill();

}
