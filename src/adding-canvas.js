function createDiv () {
    var div = document.createElement('div');
    div.style.width = '100%';
    div.style.height = '100%';
    div.style.background = 'blue';
    div.style.color = 'white';
    div.style.position = 'absolute';
    div.style.top = '0';
    div.style.opacity = '0.2';
    div.setAttribute('id','Div1');
    div.style.zIndex = '10000000000000';
    document.body.id = 'body';
  
   document.getElementById('body').appendChild(div);     
    snakeDot();
}

createDiv();


function snakeDot () {
    var snake = document.createElement('div');
    snake.style.width = '50px';
    snake.style.height = '50px';
    snake.style.background = 'red';
    document.getElementById('Div1').appendChild(snake);
}