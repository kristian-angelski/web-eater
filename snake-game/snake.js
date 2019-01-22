let key = document.getElementById('snake');
const speed = 2;
let w = document.body.offsetWidth;
let h = document.body.offsetHeight;

const directions = {
    39: { item: 'left', sign: 1 }, //right
    37: { item: 'left', sign: -1 }, //left
    40: { item: 'top', sign: 1 }, //top
    38: { item: 'top', sign: -1 }, //bottom
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

    if (parseInt(key.style.left) < 0) {
        key.style.left = w + 'px';
        key.scrollIntoView({block: "center"});
    }
    else if (parseInt(key.style.top) < 0) {
        key.style.top = h + 'px';
        key.scrollIntoView({block: "center"});
    }
    else if (parseInt(key.style.left) + key.style.width > w && direction.sign === 1) {
        key.style.left = 0;
        key.scrollIntoView({block: "center"});
    }
    else if (parseInt(key.style.top) + key.style.height > h && direction.sign === 1) {
        key.style.top = 0;
        key.scrollIntoView({block: "center"});
    }
    key.style[direction.item] = (parseInt(key.style[direction.item]) + direction.sign * speed) + 'px';
    window.requestAnimationFrame(moveSnake);
}
moveSnake();
