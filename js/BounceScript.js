var mouseX = 0;
var mouseY = 0;
var btnPlay = new Button(150,345,200,295);
var btnWon = new Button(0,500,0,500);
var btnTryAgain = new Button(175,340,215,270);
var movingObjects = [];
var movingObjectsFlaggedForRemoval = [];
var explodingObjects = [];
var explodingObjectsFlaggedForRemoval = [];
var clicked = false;
var playing = true;
var won = false;
var level = 0;
var score = 0;
var target;
var defaultRadius = 5;
var defaultSpeed = 3;
var levels = [
    {target: 1, movingObjects: 5},
    {target: 2, movingObjects: 10},
    {target: 3, movingObjects: 15},
    {target: 5, movingObjects: 20},
    {target: 7, movingObjects: 25},
    {target: 10, movingObjects: 30},
    {target: 15, movingObjects: 35},
    {target: 21, movingObjects: 40},
    {target: 27, movingObjects: 45},
    {target: 33, movingObjects: 50},
    {target: 44, movingObjects: 55},
    {target: 55, movingObjects: 60}
];

window.addEventListener('load', setup, true);

function setup(){
    drawMenu();
    document.addEventListener('click', mouseClicked, false);
}

function playGame(){
    bindEvents();
    for(var i = 0; i < levels[level].movingObjects; i++){
        movingObjects.push(createMovingObject());
    }
    target = levels[level].target;
    requestAnimationFrame(gameLoop);
}

function mouseClicked(e){
    if(!clicked){
       testClick(e);
        if (btnPlay.checkClicked()) {
            playGame();
        }
    }
}

function mouseClickedInsideDrawLevel(e){
    testClick(e);
    if(btnWon.checkClicked()){
        reset();
    }
}
//function ButtonHighScores(){
//    var btnHighScores = document.createElement('input');
//    btnHighScores.setAttribute('type', 'button');
//    btnHighScores.setAttribute('id', 'btnHighscores');
//    btnHighScores.setAttribute('value', 'Highscores');
//    canvas.appendChild(btnHighScores);
//}
function Button(xL, xR, yT, yB){
    this.xLeft = xL;
    this.xRight= xR;
    this.yTop = yT;
    this.yBottom = yB;
}

Button.prototype.checkClicked = function(){
    if(this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom)
    return true;
}

function bindEvents(){
    getCanvas().addEventListener('click', clickEvent);
}

function testClick(e){
    mouseX = e.pageX - getCanvas().offsetLeft;
    mouseY = e.pageY - getCanvas().offsetTop;
}
function clickEvent(e){
    if(!clicked){
        clicked = true;
       testClick(e);
        explodingObjects.push(createExplodingObject(mouseX, mouseY, 'rgb(255, 255, 255)'));
    }
}

function gameLoop(){
    if(playing){
        update();
        paintAll();
        requestAnimationFrame(gameLoop);
    } else{
        checkEndCondition();
    }
}

function checkEndCondition(){
    if(won && level == 11){
        var context = getContext();
        context.fillStyle = '#00FF00';
        context.fillText('Congratulations, you won!', 50, 250);
    }
    else{
        if(won) {
            level++;
        }else{
            drawTryAgain();
        }
        reset();

    }
}

function getCanvas(){
    return document.getElementById('canvas');
}

function getContext(){
    return getCanvas().getContext('2d');
}

function getLeftAndUpperBoundary(){
    return defaultRadius;
}

function getRightAndBottomBoundary(){
    return getCanvas().width - defaultRadius;
}

function createMovingObject(){
    var direction = generateNumberBetweenInterval(0, 360);
    return {
        x: generateNumberBetweenInterval(getLeftAndUpperBoundary(), getRightAndBottomBoundary()),
        y: generateNumberBetweenInterval(getLeftAndUpperBoundary(), getRightAndBottomBoundary()),
        speedX: defaultSpeed * Math.cos(convertToRadians(direction)),
        speedY: defaultSpeed * Math.sin(convertToRadians(direction)),
        radius: defaultRadius,
        color: 'rgb(' + generateNumberBetweenInterval(0, 255) + ', ' + generateNumberBetweenInterval(0, 255) + ', ' + generateNumberBetweenInterval(0, 255) + ')'
    }
}

function createExplodingObject(x, y, color){
    return {
        x: x,
        y: y,
        color: color,
        radius: defaultRadius,
        growFactor: 1,
        growThreshold: 55
    }
}

function convertToRadians(toConvert){
    return toConvert * Math.PI / 180
}

function generateNumberBetweenInterval(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function cleanArray(array){
    return removeDuplicateValues(removeFalsyValues(array));
}

function removeFalsyValues(array){
    var cleanedArray = [];
    for(var i = 0; i < array.length; i++){
        if(array[i]){
            cleanedArray.push(array[i]);
        }
    }
    return cleanedArray;
}

function removeDuplicateValues(array){
    return array.filter(function(item, pos){
        return array.indexOf(item) == pos;
    })
}

function reset(){
    score = 0;
    target = levels[level].target;
    won = false;
    playing = true;
    clicked = false;
    playGame();
}

function update(){
    checkGameEnd();
    removeFlaggedObjects();
    moveObjects();
    expandExplosions();
}

function checkGameEnd(){
    if(clicked && explodingObjects.length == 0){
        movingObjects = [];
        playing = false;
        if(target <= score){
            won = true;
        }
    }
}

function removeFlaggedObjects(){
    movingObjectsFlaggedForRemoval = removeDuplicateValues(movingObjectsFlaggedForRemoval);
    explodingObjectsFlaggedForRemoval = removeDuplicateValues(explodingObjectsFlaggedForRemoval);
    removeFlaggedMovingObjects();
    removeFlaggedExplodingObjects();
}

function removeFlaggedMovingObjects(){
    for(var i = 0; i < movingObjectsFlaggedForRemoval.length; i++) {
        score++;
        var indexToRemove = movingObjectsFlaggedForRemoval[i];
        var movingObjectToRemove = movingObjects[indexToRemove];
        explodingObjects.push(createExplodingObject(movingObjectToRemove.x, movingObjectToRemove.y, movingObjectToRemove.color));
        movingObjects[indexToRemove] = null;
    }
    movingObjectsFlaggedForRemoval = [];
    movingObjects = cleanArray(movingObjects);
}

function removeFlaggedExplodingObjects(){
    for(var i = 0; i < explodingObjectsFlaggedForRemoval.length; i++){
        var indexToRemove = explodingObjectsFlaggedForRemoval[i];
        explodingObjects[indexToRemove] = null;
    }
    explodingObjectsFlaggedForRemoval = [];
    explodingObjects = cleanArray(explodingObjects);
}

function moveObjects(){
    for(var i = 0; i < movingObjects.length; i ++){
        moveObject(movingObjects[i], i);
    }
}

function moveObject(movingObject, indexOfObject){
    checkWallCollisions(movingObject);
    checkCollisionWithExplosion(movingObject, indexOfObject);
    movingObject.x += movingObject.speedX;
    movingObject.y += movingObject.speedY;
}

function checkWallCollisions(movingObject){
    if(movingObject.x < getLeftAndUpperBoundary() || getRightAndBottomBoundary() < movingObject.x){
        movingObject.speedX = -movingObject.speedX;
    }
    if(movingObject.y < getLeftAndUpperBoundary() || getRightAndBottomBoundary() < movingObject.y){
        movingObject.speedY = -movingObject.speedY;
    }
}

function checkCollisionWithExplosion(movingObject, indexOfObject){
    for(var i = 0; i < explodingObjects.length; i++){
        var distanceBetweenBubbles = Math.sqrt(Math.pow((movingObject.x - explodingObjects[i].x), 2) + Math.pow((movingObject.y - explodingObjects[i].y), 2));
        if(distanceBetweenBubbles < explodingObjects[i].radius){
            movingObjectsFlaggedForRemoval.push(indexOfObject);
        }
    }
}

function expandExplosions(){
    for(var i = 0; i < explodingObjects.length; i++){
        expandExplosion(explodingObjects[i], i);
    }
}

function expandExplosion(explodingObject, indexOfObject){
    if(explodingObject.radius < explodingObject.growThreshold){
        explodingObject.radius += explodingObject.growFactor;
    } else{
        explodingObjectsFlaggedForRemoval.push(indexOfObject);
    }
}

function drawMenu(){
    var img = document.createElement('img');
    img.onload = drawBackground;
    img.src = 'images/testje.png';
    function drawBackground(){
        getContext().drawImage(img, 0,0);
    }
}

function drawWonLevel(){
    var img = document.createElement('img');
    img.onload = drawBackground;
    img.src = 'images/nextLevel.png';
    function drawBackground(){
        getContext().drawImage(img, 0,0);
    }
}

function drawTryAgain(){
    var img = document.createElement('img');
    img.onload = drawBackground;
    img.src = 'images/tryAgain.png';
    function drawBackground(){
        getContext().drawImage(img, 0,0);
    }
}
function paintAll(){
    paintBackground();
    var gameObjects = movingObjects.concat(explodingObjects);
    for(var i = 0; i < gameObjects.length; i++){
        paintObject(gameObjects[i]);
    }
    paintScore();
}

function paintBackground(){
    var canvas = getCanvas();
    var context = getContext();
    context.fillStyle = '#000000';
    context.fillRect(0, 0, canvas.width, canvas.height);
}

function paintObject(movingObject){
    var context = getContext();
    context.fillStyle = movingObject.color;
    context.strokeStyle = '#FFFFFF';
    context.beginPath();
    context.arc(movingObject.x, movingObject.y, movingObject.radius, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
}

function paintScore(){
    var context = getContext();
    context.fillStyle = '#00FF00';
    context.font = "26px Courier";
    context.fillText(score + '/' + target, 10, 26);
}