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

function createParagraph() {
    let paragraph = document.createElement('p');
    paragraph.style.width = '20%';
    paragraph.style.height = '20%';
    paragraph.style.zIndex = '2';
    paragraph.style.position = 'absolute';
    paragraph.style.right = '20px';
    paragraph.style.top = '20px';
    paragraph.setAttribute('id', 'p1');
    var info = document.getElementById('p1');
    info.textContent = 'WEB EATER<br/>Use arrow keys to move.<br/>To win the game, eat all the webpage elements';
    }

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
let direction = 'right';

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

    for (let i = 0; i < snake.length; i++) {
        var snakeCurrentDot = document.getElementById(snake[i].id);

        if (parseInt(snakeCurrentDot.style.left) < 0) {
            snake[i].x = w - snakeDotSize;
        } else if (parseInt(snakeCurrentDot.style.top) < 0) {
            snake[i].y = h - snakeDotSize;
        } else if (parseInt(snakeCurrentDot.style.left) + parseInt(snakeCurrentDot.style.width) > w) {
            snake[i].x = 0
        } else if (parseInt(snakeCurrentDot.style.top) + parseInt(snakeCurrentDot.style.height) > h) {
            snake[i].y = 0;
        }

        var directionData = directions[direction];

       

        if (directionData.item === 'left') {
            snake[i].x += directionData.sign * speed;
        } else {
            snake[i].y += directionData.sign * speed;
        }

        snakeCurrentDot.style.left = snake[i].x + 'px';
        snakeCurrentDot.style.top = snake[i].y + 'px';
    }
    document.getElementById(snake[0].id).scrollIntoView({
        block: "center"
    });
    window.requestAnimationFrame(moveSnake);

}
makeSnakeItem();
moveSnake();

function makeSnakeItem() {
    var x = 0;
    var y = 0;
    if (snake.length > 0) {
        var previousItem = snake[snake.length - 1];
        x = previousItem.x;
        y = previousItem.y;
        debugger;
        switch (direction) {
            case 'left':
            case 'right':
                x += (directions[direction].sign * -1) * snakeDotSize;
                break;
            case 'top':
            case 'down':
                y += (directions[direction].sign * -1) * snakeDotSize;
                break;
        }

    }

    var newDot = {
        x,
        y,
        direction,
        id: 'snake' + snake.length
    }
    makeDot(newDot);
    snake.push(newDot);
}

function makeDot(newDot) {
    var snakeItem = document.createElement('div');
    snakeItem.setAttribute('id', newDot.id);
    snakeItem.style.borderRadius = '100px';
    snakeItem.style.width = snakeDotSize + 'px';
    snakeItem.style.height = snakeDotSize + 'px';
    snakeItem.style.background = (snake.length === 0) ? 'black' : 'yellow';
    snakeItem.style.position = 'absolute';
    snakeItem.style.zIndex = '10000000000000';
    snakeItem.style.top = newDot.y + 'px';
    snakeItem.style.left = newDot.x + 'px';
    document.body.appendChild(snakeItem);
}