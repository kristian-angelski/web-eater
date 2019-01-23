function init() {
    window.virtualDom = new Dom();
    
    virtualDom.setPointerEvents(virtualDom.getElementsWithHighestCount()); //call this every level


    createDiv();
    
    //  GLOBAL VARIABLES
    window.snakeHead = document.getElementById('snake');
    window.speed = 2; //default speed of movement
    window.bodyWidth = document.body.offsetWidth;
    window.bodyHeight = document.body.scrollHeight;

    moveSnake();
}








class Dom {

    constructor() {
        this.elementsSortedByDepth = [];
        this.elementsSortedByNum = [];

        //fills the arrays elementsSortedByDepth and elementsSortedByNum
        //and sets a property onto Dom for each type of tagName on the page
        this._getPageElements(document.body, 0)._sortByNumElements();

        //disable pointer clicks 
        // needed for elementsFromPoint()
        document.querySelector('html').style.pointerEvents = 'none';

        return this;
    }

    /**
     * Internal method
     * 
     * @param {HTMLObjectElement} element 
     * @param {Number} depth 
     */
    _getPageElements(element,depth) { //called for every element

        this._sortByDepth(element,depth);
        let elementTag = element.tagName.toLowerCase();
        element.style.pointerEvents = 'none';   //set every elements pointer events to none
    
        if(this[elementTag])         //if this property exists
            this[elementTag].push(element); //push element into it
        else
            this[elementTag] = [element]; //create array and store elements inside 
    
        for(var i=0; i<element.children.length; i++) {  //recursive call for each element
            element.depth = depth;
            this._getPageElements(element.children[i],depth+1);
        }

        return this;
    }


    /**
     * Internal method
     * 
     * @param {HTMLObjectElement} element 
     * @param {Number} depth 
     */
    _sortByDepth(element, depth) {
        if(this.elementsSortedByDepth[depth])
            this.elementsSortedByDepth[depth].push(element);
        else
            this.elementsSortedByDepth[depth] = [element];
        
        return this;
    }



    /**
     * Internal method
     * 
     * 
     */
    _sortByNumElements() {
    
        Object.keys(this).forEach(function(key) {
            if(key != "elementsSortedByNum")
                this.elementsSortedByNum.push( {numOfElements: this[key].length, tagName: key} );
        }.bind(this));
    
        this.elementsSortedByNum.sort(function (a,b) { return a.numOfElements - b.numOfElements });
        return this;
    }

    /**
     * 
     * @param {String} name 
     * @returns {Array<HTMLElement>} this[name]
     */
    getElementsByTagName(name) {
        return this[name];
    }

    /**
     * Returns and removes the array containing the elements with the highest count
     * @returns {Array<HTMLElement>} E.g. returns all div elements if div is the highest encountered element tag
     */
    getElementsWithHighestCount() {
        return this[this.elementsSortedByNum.pop().tagName];
    }

    /**
     * @returns {Array<HTMLElement>} E.g. returns all div elements if div is the lowest encountered element tag
     */
    getElementsWithLowestCount() {
        return this[this.elementsSortedByNum.shift().tagName];
    }

    smoothScrollTo(element) {
        element.scrollIntoView({behavior: "smooth"});
    }

    setPointerEvents(HTMLArray){
        HTMLArray.forEach( function(element) {
            element.style.pointerEvents = 'auto';
        })

        return this;
    }

}

Dom.utilities = {


    /**
     * Get the absolute page coordiantes of an element.
     * @param {HTMLElement} elem 
     */
    getAbsolutePageCoordinates(elem) {
        let box = elem.getBoundingClientRect();
    
        return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset,
        bottom: box.bottom + pageYOffset,
        right: box.right + pageXOffset
        };
    },

    getDistanceBetween2Points: function(x1, y1, x2, y2) {
        let a = x2-x1;
        let b = y2-y1;

        return Math.sqrt( a*a + b*b );
    },

    getCenterOfRect: function(rect) {
        return  {
                    x: (rect.offsetWidth - rect.style.left)/2,
                    y: (rect.offsetHeight - rect.style.top)/2 
                };
    }
}




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