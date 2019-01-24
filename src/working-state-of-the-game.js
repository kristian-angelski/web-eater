var snake = [];
const snakeDotSize = 30;

function createDiv() {
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'rgba(255, 255, 255, .4)';
    div.style.color = 'white';
    div.style.position = 'fixed';
    div.style.top = '0';
    div.style.opacity = '0.2';
    div.setAttribute('id', 'Div1');
    div.style.zIndex = '10000000000000';
    document.body.id = 'body';
    document.getElementById('body').appendChild(div);
}

createDiv();

function snakeDot() {
    let snakeBody = document.createElement('div');
    snakeBody.setAttribute('id', 'snake');
    snakeBody.style.border = '1px solid black';
    snakeBody.style.borderRadius = '100px';
    snakeBody.style.width = '30px';
    snakeBody.style.height = '30px'
    snakeBody.style.background = 'black';
    snakeBody.style.position = 'absolute';
    snakeBody.style.zIndex = '10000000000000';
    document.body.id = 'body';
    document.getElementById('body').appendChild(snakeBody);
}

let key = document.getElementById('snake');
const speed = 2;
let w = document.body.offsetWidth;
let h = document.body.scrollHeight;

const directions = {
    'right': {
        item: 'left',
        sign: 1
    }, //right
    'left': {
        item: 'left',
        sign: -1
    }, //left
    'down': {
        item: 'top',
        sign: 1
    }, //top
    'top': {
        item: 'top',
        sign: -1
    }, //bottom
}
let direction = directions['right'];
key.style.left = '0px';
key.style.top = '0px';
const keycodesToDirection = {
    39: 'right',
    37: 'left',
    40: 'down',
    38: 'top'
};


document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (Object.keys(keycodesToDirection).indexOf(String(event.keyCode)) != -1) {
        direction = keycodesToDirection[event.keyCode];
    }
}

function moveSnake() {
    let a = getCurrentTailLocation();
    let tail = document.getElementsByClassName('snake');
    for (let i = 0; i < tail.length; i++) {
        // if (tail[i] === 0) {
        //     tail[i].style.left = a.left -30 + 'px';
        //     tail[i].style.top = a.top -30 + 'px'
        // }
        // else {
        //     tail[i].style.left = tail[i-1].left - 30;
        //     tail[i].style.top = tail[i-1].top - 30;
        // }

    }


    key.scrollIntoView({
        block: "center"
    });

    if (parseInt(key.style.left) < 0) {
        key.style.left = (w - parseInt(key.style.width)) + 'px';
    } else if (parseInt(key.style.top) < 0) {
        key.style.top = (h - parseInt(key.style.width)) + 'px';
    } else if (parseInt(key.style.left) + parseInt(key.style.width) > w) {
        key.style.left = 0;
    } else if (parseInt(key.style.top) + parseInt(key.style.height) > h) {
        key.style.top = 0;
    }
    var directioData = directions[direction];
    key.style[directioData.item] = (parseInt(key.style[directioData.item]) + directioData.sign * speed) + 'px';
    window.requestAnimationFrame(moveSnake);

}
moveSnake();


function makeSnakeItem() {
    var x = 0;
    var y = 0;
    if (snake.length > 0) {
        var previousItem = snake[snake.length - 1];
        x = previousItem.left;
        y = previousItem.top;
        switch (direction) {
            case 'left':
            case 'right':
                x += directions[direction].sign * snakeDotSize;
                break;
            case 'top':
            case 'down':
                y += directions[direction].sign * snakeDotSize;
                break;
        }
        
    } 

    var snakeItem = document.createElement('div');
    snakeItem.setAttribute('class', 'snake');
    snakeItem.style.borderRadius = '100px';
    snakeItem.style.width = snakeDotSize + 'px';
    snakeItem.style.height = snakeDotSize + 'px';
    snakeItem.style.background = (snake.length === 0) ? 'black' : 'yellow';
    snakeItem.style.position = 'absolute';
    snakeItem.style.zIndex = '10000000000000';
    snakeItem.style.top = y;
    snakeItem.style.left = x;
    snake.push(snakeItem);

}

function getCurrentTailLocation() {
    return document.getElementById('snake').getBoundingClientRect();
}