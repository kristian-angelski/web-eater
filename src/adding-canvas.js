function createDiv () {
    let div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'rgba(255, 255, 255, .4)';
    div.style.color = 'white';
     div.style.position = 'relative';
    div.style.top = '0';
    //div.style.opacity = '0.2';
    div.setAttribute('id','Div1');
    div.style.zIndex = '10000000000000';
    document.body.id = 'body';
  
   document.getElementById('body').appendChild(div);     
    snakeDot();
}

createDiv();


function snakeDot () {
    let snake = document.createElement('div');
    snake.setAttribute('id','snake');
    snake.style.border = '1px solid black';
    snake.style.borderRadius = '10px';
    snake.style.width = '30px';
    snake.style.height = '30px';
    snake.style.background = 'black';
    snake.style.position = 'absolute';
    document.getElementById('Div1').appendChild(snake);
}


    let key = document.getElementById('snake');
    console.log(key);
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
 

    


