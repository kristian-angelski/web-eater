function createDiv() {
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'rgba(255, 255, 255, .4)';
    div.style.color = 'white';
    div.style.position = 'fixed';
    div.style.top = '0';
    //div.style.opacity = '0.2';
    div.setAttribute('id', 'Div1');
    div.style.zIndex = '10000000000000';
    document.body.id = 'body';
    document.getElementById('body').appendChild(div);
    snakeDot();
}

createDiv();
function snakeDot() {
    let snake = document.createElement('div');
    snake.setAttribute('id', 'snake');
    snake.style.border = '1px solid black';
    snake.style.borderRadius = '100px';
    snake.style.width = '30px';
    snake.style.height = '30px';
    snake.style.background = 'black';
    snake.style.position = 'absolute';
    snake.style.zIndex = '10000000000000';
    document.getElementById('body').appendChild(snake);
}

let key = document.getElementById('snake');
const speed = 2;
let w = document.body.offsetWidth;
let h = document.body.scrollHeight;

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
key.style.left = '0px';
key.style.top = '0px';


document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
        direction = directions[event.keyCode];
    }
}

function moveSnake() {

    key.scrollIntoView({block: "center"});

    if (parseInt(key.style.left) < 0) {
        key.style.left = (w - parseInt(key.style.width)) + 'px';
    }
    else if (parseInt(key.style.top) < 0) {
        key.style.top = (h - parseInt(key.style.width)) + 'px';
    }
    else if (parseInt(key.style.left) + parseInt(key.style.width) > w) {
        key.style.left = 0;
    }
    else if (parseInt(key.style.top) + parseInt(key.style.height) > h) {
        key.style.top = 0;
    }
    key.style[direction.item] = (parseInt(key.style[direction.item]) + direction.sign * speed) + 'px';
    window.requestAnimationFrame(moveSnake);
}
moveSnake();
