var snake = [];

/**
 * Creates a div element that is appended to <body> 
 * This div acts as a layer on top of the <body>
 */
function createDiv() {
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'rgba(255, 255, 255, .3)'; //set opacity 
    div.style.color = 'white';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.setAttribute('id', 'Div1');
    div.style.zIndex = '10000000000000';
    document.body.id = 'body';
    document.getElementById('body').appendChild(div);
    snake.push(div);
    snake.push(div);
    snake.push(div);
    snakeDot();
}
createDiv();

/**
 * Creates the Snake and appends it to <body>
 */
function snakeDot() {
    let snake = document.createElement('div');
    snake.setAttribute('id', 'snake');
    snake.style.border = '1px solid black';
    snake.style.borderRadius = '100px';
    snake.style.left = '0px'; //start position
    snake.style.top = '0px';
    snake.style.width = '30px';
    snake.style.height = '30px'
    snake.style.background = 'black';
    snake.style.position = 'absolute';
    snake.style.zIndex = '10000000000000';
    document.getElementById('body').appendChild(snake);
}


//  GLOBAL VARIABLES
let snakeHead = document.getElementById('snake');
let speed = 2; //default speed of movement
let bodyWidth = document.body.offsetWidth;
let bodyHeight = document.body.scrollHeight;

const directions = {
    39: {
        item: 'left',
        sign: 1
    }, //right
    37: {
        item: 'left',
        sign: -1
    }, //left
    40: {
        item: 'top',
        sign: 1
    }, //top
    38: {
        item: 'top',
        sign: -1
    }, //bottom
}
let direction = directions['39'];


// EVENT LISTENERS
document.addEventListener('keydown', changeDirection);                  
document.addEventListener('keyup', decreaseSpeed);


function changeDirection(event) {
    if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
        speed = 5;
        direction = directions[event.keyCode];
    }
}

function decreaseSpeed() {
    if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
        speed = 2;
    }
}



/**
 * The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.
 * 
 * @param {Number} timestamp - argument of requestAnimationFrame that is automatically passed when the method is called. Similar to performance.now()
 */
function moveSnake(timestamp) {

    snakeHead.scrollIntoView({block: "center"}); //scroll view around the snake

    //define values so we don't have to compute them multiple times.
    //also makes code a bit easier to read.
    let left = parseInt(snakeHead.style.left);
    let top = parseInt(snakeHead.style.top);
    let elemWidth = parseInt(snakeHead.style.width);
    let elemHeight = parseInt(snakeHead.style.height);

    let viewportCoords = snakeHead.getBoundingClientRect();
    var elements = document.elementsFromPoint(viewportCoords.left+16, viewportCoords.top+16);

    if(timestamp %100 < 20)
        console.log(elements);

    
    if (left < 0) {                                             //exits left side
        snakeHead.style.left = (bodyWidth - elemWidth) + 'px';
    }
    else if (top < 0) {                                         // exits top side
        snakeHead.style.top = (bodyHeight - elemHeight) + 'px';
    }
    else if (left + elemWidth > bodyWidth) {                    // exits right side
        snakeHead.style.left = 0;
    }
    else if (top + elemHeight > bodyHeight) {                   //exits bottom side
        snakeHead.style.top = 0;
    }


    snakeHead.style[direction.item] = (parseInt(snakeHead.style[direction.item]) + direction.sign * speed) + 'px';      //set the new position
    window.requestAnimationFrame(moveSnake);                                                                    //call the fn again
}
moveSnake();


function candy () {

    var randomHeight = Math.random() * (bodyHeight - 1) + 1;
    var randomWidth = Math.random () * (bodyWidth - 1) + 1;

    var candy = document.createElement('div');
    candy.id = 'candy';
    candy.style.border = '1px solid black';
    candy.style.borderRadius = '100px';
    candy.style.width = '30px';
    candy.style.height = '30px'
    candy.style.background = 'green';
    candy.style.position = 'absolute';
    candy.style.zIndex = '10000000000000';

    snakeHead.style.left = (parseInt(randomWidth)) + 'px';
    snakeHead.style.top = (parseInt(randomHeight)) + 'px';

    document.getElementById('body').appendChild(candy);
    snake.push(candy);
    console.log(snake);
    console.log(snake.length);
}


candy();

function snakeTail () {
    snake.forEach(element => {
        document.getElementById('body').appendChild(element);
    });
}

snakeTail();