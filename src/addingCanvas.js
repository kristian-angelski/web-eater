function createDiv () {
    var div = document.createElement('div');
    div.style.width = '100vw';
    div.style.height = '100vh';
    div.style.background = 'blue';
    div.style.color = 'white';
    div.style.position = 'absolute';
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
    snake.style.opacity = '1';
    document.getElementById('Div1').appendChild(snake);
}