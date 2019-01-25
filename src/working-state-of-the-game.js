const gameConstants = {
	maxPageWidth: document.body.offsetWidth,
	maxPageHeight: document.body.scrollHeight,
	snakeBodySize: 20,
	sizeDimension: 'px'
};

const directions = {
	'right': {
		item: 'right',
		inputMapping: [39]
	},
	'left': {
		item: 'left',
		inputMapping: [37]
	},
	'down': {
		item: 'bottom',
		inputMapping: [40]
	},
	'top': {
		item: 'top',
		inputMapping: [38]
	},
}

class Snake {
	constructor(maxWidthUnits, maxHeightUnits) {
		this.maxWidthUnits = maxWidthUnits;
		this.maxHeightUnits = maxHeightUnits;
		this.snakeBody = [];
		this.snakeHeadPosition = {
			x: 0,
			y: 0,
		};
		this.snakeHeadDOM = createSnakeHead();
		this.direction = directions.right;
		this.addBody();
		this.addBody();
		this.addBody();
	}

	move() {
		let newSnakeHeadPosition = {
			x: this.snakeHeadPosition.x,
			y: this.snakeHeadPosition.y
		};
		switch (this.direction) {
			case directions.right:
				newSnakeHeadPosition.x = this.snakeHeadPosition.x + 1;
				if (newSnakeHeadPosition.x > this.maxWidthUnits) {
					newSnakeHeadPosition.x = 0;
				}
				break;
			case directions.left:
				newSnakeHeadPosition.x = this.snakeHeadPosition.x - 1;
				if (newSnakeHeadPosition.x < 0) {
					newSnakeHeadPosition.x = this.maxWidthUnits;
				}
				break;
			case directions.down:
				newSnakeHeadPosition.y = this.snakeHeadPosition.y + 1;
				if (newSnakeHeadPosition.y > this.maxHeightUnits) {
					newSnakeHeadPosition.y = 0;
				}
				break;
			case directions.top:
				newSnakeHeadPosition.y = this.snakeHeadPosition.y - 1;
				if (newSnakeHeadPosition.y < 0) {
					newSnakeHeadPosition.y = this.maxHeightUnits;
				}
				break;
		}
		let firstElement = this.snakeBody.shift();
		let oldSnakePosition = this.snakeHeadPosition;
		firstElement.x = oldSnakePosition.x;
		firstElement.y = oldSnakePosition.y;
		this.snakeBody.push(firstElement);

		this.snakeHeadPosition = newSnakeHeadPosition;
	}

	getSnakeBody() {
		return this.snakeBody.concat([{
			x: this.snakeHeadPosition.x,
			y: this.snakeHeadPosition.y,
			DOMElement: this.snakeHeadDOM
		}]);
	}

	changeDirection(direction) {
		this.direction = direction;
	}

	addBody() {
		this.snakeBody.push({
			x: 0,
			y: 0,
			DOMElement: createSnakeBody()
		});
	}
}

function draw(snake) {
	let snakeBody = snake.getSnakeBody().reverse();
	for (element of snakeBody) {
		element.DOMElement.style.left = (element.x * gameConstants.snakeBodySize) + gameConstants.sizeDimension;
		element.DOMElement.style.top = (element.y * gameConstants.snakeBodySize) + gameConstants.sizeDimension;
	}
}

function createSnakeBody() {
	let snakeItem = document.createElement('div');
	snakeItem.style.width = gameConstants.snakeBodySize + gameConstants.sizeDimension;
	snakeItem.style.height = gameConstants.snakeBodySize + gameConstants.sizeDimension;
	snakeItem.style.position = 'fixed';
	snakeItem.style.background = 'green';
	snakeItem.style.zIndex = '9999999';
	document.body.appendChild(snakeItem);
	return snakeItem;
}

function createSnakeHead() {
	let snakePart = createSnakeBody();
	snakePart.style.background = 'black';
	return snakePart;
}

// //create div to disable all background elements
// function createDiv() {
//     let div = document.createElement('div');
//     div.style.width = '100%';
//     div.style.height = '100%';
//     div.style.background = 'rgba(255, 255, 255, .4)';
//     div.style.color = 'white';
//     div.style.position = 'fixed';
//     div.style.top = '0';
//     div.style.opacity = '0.2';
//     div.setAttribute('id', 'Div1');
//     div.style.zIndex = '10000000000000';
//     document.body.id = 'body';
//     document.getElementById('body').appendChild(div);
// }


let maxWidthUnits = Math.floor(gameConstants.maxPageWidth / gameConstants.snakeBodySize);
let maxHeightUnits = Math.floor(gameConstants.maxPageHeight / gameConstants.snakeBodySize);
let snake = new Snake(maxWidthUnits, maxHeightUnits);

document.addEventListener('keydown', (event) => {
	let keyPressed = event.keyCode;
	let direction = Object.keys(directions).forEach((key) => {
		if (directions[key].inputMapping.indexOf(keyPressed) !== -1) {
			// console.log(currentDirection);
			snake.changeDirection(directions[key]);
		}
	});
});


setInterval(() => {
	snake.move();
	draw(snake);
}, 100)