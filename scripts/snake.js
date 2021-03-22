// JavaScript Document

var xSpeed, ySpeed;
var playerPositionX, playerPositionY;
var foodPositionX, foodPositionY;
var gridTileSize, amountOfTiles;

var canvas, cntext;

var trail = [];
var snakeLength = 1;
var highScore = 1;

var interval;
var createDeadSnakeInterval;

var isAlive = false;
var snakeIsTurning = false;

const canvasColor = "white";
const headColor = "black"
const snakeColor = "rgba(0, 0, 0, 0.7)";
const foodColor = "rgb(98, 161, 246)";
const deadSnakeColor = "#D61A3C";

window.onload = function() {
    this.snakeSetup();
};

// removes scroll on space and arrow keys
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// rectangle with rounded corners
CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
    return this;
}

function snakeSetup() {
    resetValues();

    createCanvas();

    // when key is pressed, run the keyPush(event)
    document.addEventListener("keydown", keyPush);

    // paint initial setup
    fillCanvas();
    spawnNewRectAt(playerPositionX, playerPositionY, headColor);
    spawnNewRectAt(foodPositionX, foodPositionY, foodColor);
    updateScoreLabel();
    updateHighscoreLabel();
}

function createCanvas() {
    canvas = document.getElementById("snake-canvas");
    cntext = canvas.getContext("2d");
    canvas.width = 398;
    canvas.height = 398;
}

function spawnNewRectAt(x, y, color) {
    cntext.fillStyle = color;
    cntext.roundRect(x * gridTileSize, y * gridTileSize, gridTileSize - 2, gridTileSize - 2, 5);
    cntext.fill();
}

function fillCanvas() {
    cntext.fillStyle = canvasColor;
    cntext.fillRect(0, 0, canvas.width, canvas.height);
}

function moveSnake() {
    playerPositionX += xSpeed;
    playerPositionY += ySpeed;
}

function updateScoreLabel() {
    cntext.font = "72px Helvetica Neue Bold";
    cntext.fillStyle = "rgb(0, 0, 0, 0.3)";

    cntext.textAlign = "center"; // horisontal alignment
    cntext.textBaseline = "middle"; // vertical alignment

    var xPos = canvas.width / 2;
    var yPos = canvas.height / 2;
    cntext.fillText(snakeLength, xPos, yPos);
}

function updateHighscoreLabel() {
    cntext.font = "18px Helvetica Neue Bold";
    cntext.fillStyle = "rgba(0, 0, 0, 0.15)";

    cntext.textAlign = "center"; // horisontal alignment

    var xPos = canvas.width / 2;
    var yPos = canvas.height / 2 + 50;
    cntext.fillText("Highscore: " + highScore, xPos, yPos);
}

function updateHighscore() {
    if (snakeLength > highScore) {
        highScore = snakeLength;
    }
}

function updateFoodPosition() {
    foodPositionX = Math.floor(Math.random() * amountOfTiles);
    foodPositionY = Math.floor(Math.random() * amountOfTiles);
}

function update() {
    snakeIsTurning = false;

    moveSnake();

    fillCanvas();

    // fill snake
    for (var i = 0; i < trail.length; i++) {
        clearInterval(interval);
        interval = setInterval(update, 90 - i);

        if (i == trail.length - 1) {
            spawnNewRectAt(trail[i].x, trail[i].y, headColor);
        } else {
            spawnNewRectAt(trail[i].x, trail[i].y, snakeColor);
        }

        // snake hit itself
        if (trail[i].x === playerPositionX && trail[i].y === playerPositionY) {
            die();

            return;
        }
        // snake hit border
        else if ((playerPositionX < 0 || playerPositionX > amountOfTiles - 1 || playerPositionY < 0 || playerPositionY > amountOfTiles - 1)) {
            die();

            return;
        }
    }

    // add new position of head to trail
    trail.push({
        x: playerPositionX,
        y: playerPositionY
    });

    // removes the first element of the array (the last one in the graphical trail)
    // note: an if-statement would do the same thing as while
    while (trail.length > snakeLength) {
        trail.shift();
    }

    // snake hit food (with head)
    if (foodPositionX === playerPositionX && foodPositionY === playerPositionY) {
        snakeLength++;

        updateFoodPosition();

        updateHighscore();
    }

    spawnNewRectAt(foodPositionX, foodPositionY, foodColor);
    updateScoreLabel();
    updateHighscoreLabel();
}

function keyPush(event) {
    switch (event.keyCode) {
        // left
        case 37:
            if (isAlive && snakeIsTurning == false) {
                if (xSpeed !== 1) {
                    xSpeed = -1;
                    ySpeed = 0;
                    snakeIsTurning = true;
                }
            }
            break;
            // right
        case 38:
            if (isAlive && snakeIsTurning == false) {
                if (ySpeed !== 1) {
                    xSpeed = 0;
                    ySpeed = -1;
                    snakeIsTurning = true;
                }
            }
            break;
            // down
        case 39:
            if (isAlive && snakeIsTurning == false) {
                if (xSpeed !== -1) {
                    xSpeed = 1;
                    ySpeed = 0;
                    snakeIsTurning = true;
                }
            }
            break;
            // up
        case 40:
            if (isAlive && snakeIsTurning == false) {
                if (ySpeed !== -1) {
                    xSpeed = 0;
                    ySpeed = 1;
                    snakeIsTurning = true;
                }
            }
            break;
            // space
        case 32:
            if (!isAlive) {
                resetValues();
                interval = setInterval(update, 90);
                if (ySpeed !== -1) {
                    xSpeed = 0;
                    ySpeed = 1;
                }
                isAlive = true;
            }
            break;
    }
}

function die() {
    clearInterval(interval);

    stopSnake();

    // repaint everything
    fillCanvas();
    updateScoreLabel();
    updateHighscoreLabel();
    spawnNewRectAt(foodPositionX, foodPositionY, foodColor);

    if (isAlive) {
        createDeadSnake();
    }

    isAlive = false;
}

var deadSnakeIndex;

function createDeadSnake() {
    fillSnake();

    deadSnakeIndex = trail.length - 1;
    deadSnakeAnimation(); // no delay
    createDeadSnakeInterval = setInterval(deadSnakeAnimation, 40);
}

function fillSnake() {
    for (var i = 0; i < trail.length; i++) {
        if (i == trail.length - 1) {
            spawnNewRectAt(trail[i].x, trail[i].y, headColor);
        } else {
            spawnNewRectAt(trail[i].x, trail[i].y, snakeColor);
        }
    }
}

function deadSnakeAnimation() {
    if (deadSnakeIndex < 0) {
        clearInterval(createDeadSnakeInterval);
    }

    if (deadSnakeIndex != trail.length - 1) {
        spawnNewRectAt(trail[deadSnakeIndex].x, trail[deadSnakeIndex].y, deadSnakeColor);
    } else {
        spawnNewRectAt(trail[deadSnakeIndex].x, trail[deadSnakeIndex].y, headColor);
    }

    deadSnakeIndex--;
}

function stopSnake() {
    xSpeed = 0;
    ySpeed = 0;
}

function resetValues() {
    trail = [];
    xSpeed = 0;
    ySpeed = 0;
    snakeLength = 1;
    playerPositionX = 5;
    playerPositionY = 5;
    foodPositionX = 15;
    foodPositionY = 15;
    gridTileSize = amountOfTiles = 20;
}