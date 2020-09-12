const { canvasWidth, canvasHeight } = require('./constants');

module.exports = {
    initGame,
    gameLoop
}
//init game 
function initGame() {
    let state = createGameState(); 
    return state;
}


//game state 
function createGameState() {
    return {
        players : [
        {
            paddleWidth : 10,
            paddleHeight : 75, 
            x : 10, 
            y : (canvasHeight - 75) / 2, 
            dx : 0, 
            dy : 10, 
            upKeyPressed: false,
            downKeyPressed: false    
    },
    {        
            paddleWidth : 10,
            paddleHeight : 75, 
            x : canvasWidth - 20, 
            y : (canvasHeight - 75) / 2, 
            dx : 0, 
            dy : 10,
            upKeyPressed: false,
            downKeyPressed: false   
    }], 
        ball : {
            ballRadius : 10,
            x : canvasWidth/2, 
            y : canvasHeight/2,
            dx : -3, 
            dy : 0
             
        }
    }
}


function gameLoop(state) {
    //ball variables 
    let ballDx = state.ball.dx; 
    let ballDy = state.ball.dy;
    let ballRadius = state.ball.ballRadius;  
    //ball logic(hitting top and bottom walls) 
    if(state.ball.y + ballDy < ballRadius || state.ball.y + ballDy > canvasHeight - ballRadius) {
        state.ball.dy *= -1; 
    }
    // hitting left or right walls
    else if (state.ball.x + ballDx >= state.players[1].x) {
        if(state.ball.y > state.players[1].y && state.ball.y < state.players[1].y + state.players[1].paddleHeight) {
            state.ball.dx *= -1;
        }
        else {
            return 1; // player 1 won 
        }
    }
    else if (state.ball.x + ballDx <= state.players[0].x + ballRadius) {
        if(state.ball.y > state.players[0].y && state.ball.y < state.players[0].y + state.players[0].paddleHeight) {
            state.ball.dx *= -1;
        }
        else {
            return 2; // player 2 won 
        }
    }
    //paddle movement logic
    if(state.players[0].downKeyPressed && state.players[0].y < (canvasHeight - state.players[0].paddleHeight)) {
        state.players[0].y += state.players[0].dy;
    }
    else if(state.players[0].upKeyPressed && state.players[0].y > 0) {
        state.players[0].y -= state.players[0].dy;
    }
    else if(state.players[1].downKeyPressed && state.players[1].y < (canvasHeight - state.players[1].paddleHeight)) {
        state.players[1].y += state.players[1].dy;
    }
    else if(state.players[1].upKeyPressed && state.players[1].y > 0) {
        state.players[1].y -= state.players[1].dy;
    }
    //move ball 
    state.ball.x += ballDx; 
    state.ball.y += ballDy;
    return false

}
