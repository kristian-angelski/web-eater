//global variables
let snake = [];
let w = document.body.offsetWidth;
let h = document.body.scrollHeight;
let direction = 'right';
const snakeDotSize = 30;
const speed = 2;
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
const keycodesToDirection = {
    39: 'right',
    37: 'left',
    40: 'down',
    38: 'top'
};
//create div to disable all background elements
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

document.addEventListener('keydown', changeDirection);

function changeDirection(event) {
    if (Object.keys(keycodesToDirection).indexOf(String(event.keyCode)) != -1) {
        direction = keycodesToDirection[event.keyCode];
        snake[0].direction = direction;
        snake[0].oldDirection = direction;
    }
}

function moveSnake() {

    for (let i = 0; i < snake.length; i++) {
        let snakeCurrentDot = document.getElementById(snake[i].id);
        if (i + 1 < snake.length) {
            let currDirection = directions[snake[i].direction];
           // console.log(currDirection)
           
                snake[i + 1].previousY = snake[i].y + snakeDotSize;
                snake[i + 1].previousX = snake[i].x
                snake[i + 1].oldDirection = snake[i].direction;
          
                snake[i + 1].previousX = snake[i].x + snakeDotSize;
                snake[i + 1].previousY = snake[i].y
                snake[i + 1].oldDirection = snake[i].direction;
      

           
        }

        if (snake[i].direction !== snake[i].oldDirection) {
            snake[i].x = snake[i].previousX;
            snake[i].y = snake[i].previousY;
            snake[i].direction = snake[i].oldDirection;
        } else {
            if (parseInt(snakeCurrentDot.style.left) < 0) {
                snake[i].x = w - snakeDotSize;
            } else if (parseInt(snakeCurrentDot.style.top) < 0) {
                snake[i].y = h - snakeDotSize;
            } else if (parseInt(snakeCurrentDot.style.left) + parseInt(snakeCurrentDot.style.width) > w) {
                snake[i].x = 0
            } else if (parseInt(snakeCurrentDot.style.top) + parseInt(snakeCurrentDot.style.height) > h) {
                snake[i].y = 0;
            }

        }

        // if(direction !== snake[i].oldDirection) {
        //     debugger;
        // }

        let directionData = directions[snake[i].direction];
        if (directionData.item === 'left') {
            snake[i].x += directionData.sign * speed;
        } else {
            snake[i].y += directionData.sign * speed;
        }

        // snakeCurrentDot.previousX = snakeCurrentDot.style.top;
        // snakeCurrentDot.previousY = snakeCurrentDot.style.left;

        // if (i>0) {
        //     let snakePrevousDot  = document.getElementById(snake[i-1].id);
        //     snakeCurrentDot.pr
        //     snakePrevousDot.style.top = snakeCurrentDot.previousX;
        //     snakePrevousDot.style.left = snakeCurrentDot.previousY;
        //     snakePrevousDot.direction = snakeCurrentDot.oldDirection;
        // }

        // snakeCurrentDot.previousX = snakePrevousDot.x
        // snakeCurrentDot.previousX = snake
        // if (i>0) {

        //     snakePrevousDot.style.top = snakeCurrentDot.style.top;
        //     snakePrevousDot.style.left = snakeCurrentDot.style.left;
        //     snakePrevousDot.direction = snakeCurrentDot.oldDirection;
        //     snakeCurrentDot.style.top = snakePrevousDot.style.top;
        //     snakeCurrentDot.style.left = snake.snakePrevousDot.style.left;
        // }



        // if (snake[i].oldDirection !== 0) {
        //     if (snake[i].direction !== snake[i].oldDirection) {
        //         snake[i].direction === snake[i].oldDirection;
        //     }
        // }
        snakeCurrentDot.style.left = snake[i].x + 'px';
        snakeCurrentDot.style.top = snake[i].y + 'px';

    }
    document.getElementById(snake[0].id).scrollIntoView({
        block: "center"
    });
    window.requestAnimationFrame(moveSnake);

}

function makeSnakeItem() {
    console.log(direction);
    let x = 0;
    let y = 0;
    let previousItem = 0;
    if (snake.length > 0) {
        previousItem = snake[snake.length - 1];
        x = previousItem.x;
        y = previousItem.y;
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

    let newDot = {
        x,
        y,
        oldDirection: direction,
        direction: direction,
        previousX: 0,
        previousY: 0,
        id: 'snake' + snake.length
    }
    console.log(newDot);
    //if direction is different check
    makeDot(newDot);
    snake.push(newDot);
}

function makeDot(newDot) {
    let snakeItem = document.createElement('div');
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

$(document).ready(function () {
    createDiv();
    makeSnakeItem();
    moveSnake();
});