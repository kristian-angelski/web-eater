(function SnakeGame() {
    //GLOBAL VARIABLES
    const defaultSpeed = 2;
    const speedOnKeyPressed = 12;
    let speed = defaultSpeed;
    let htmlPage = document.querySelector('html');
    let bodyWidth = htmlPage.scrollWidth;
    let bodyHeight = htmlPage.scrollHeight;
    let level = 1;
    let currentPoints = 0;
    const firstLvlFood = ['symbols', 'coordsOfSymbols'];
    const secondLvlFood = ['b', 'big', 'i', 'small', 'tt', 'a', 'bdo', 'br', 'img', 'map', 'object', 'q', 'script', 'span', 'sub', 'sup'];
    const thirdLvlFood = ['abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'button', 'input', 'label', 'select', 'textarea'];
    const fourthLvlFood = ['table', 'noscript', 'hr', 'form', 'fieldset', 'div', 'dl', 'h4', 'h5', 'h6'];
    const fifthLvlFood = ['p', 'h1', 'h2', 'h3', 'ol', 'ul', 'pre', 'address', 'blockquote'];
    let eaten = {};
    /**
	 * Levels - containing different points required for a level up
	 * and each level's different foods
	 */
    let levels = {
        1: {
            food: firstLvlFood,
            pointsToLevel: 200,
            speed: 2,
        },
        2: {
            food: secondLvlFood,
            pointsToLevel: 600,
            speed: 3
        },
        3: {
            food: thirdLvlFood,
            pointsToLevel: 1000,
            speed: 4
        },
        4: {
            food: fourthLvlFood,
            pointsToLevel: 1600,
            speed: 5
        },
        5: {
            food: fifthLvlFood,
            pointsToLevel: 2000,
            speed: 6
        }
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

    let snake = [];


    function init() {

        window.virtualDom = new Dom();
        
        createDiv();
        moveSnake();
        createUserElements();
        createUserInstructions();
        createGameInfo();
    };



    class Dom {

        constructor() {
            this.elementsSortedByDepth = [];
            this.elementsSortedByNum = [];
            this.currentLevelElements = [];

            //fills the arrays elementsSortedByDepth and elementsSortedByNum
            //and sets a property onto Dom for each type of tagName on the page
            this._getPageElements(document.body, 0);
            this._sortByNumElements();
            this.nextLevel(this.getElementsWithMostDepth());  //the array of HTML elements to put into the next level

            return this;
        }

        /**
         * Internal method
         * 
         * Cycles through every element on the page when the game is initialized.
         * 
         * @param {HTMLObjectElement} element 
         * @param {Number} depth 
         */
        _getPageElements(element, depth) { //called for every element

            element.style.pointerEvents = 'none';   //set every elements pointer events to none
            this._sortByDepth(element, depth);

            if (element.clientHeight > 0 && element.clientWidth > 0) { //check if element has width or height

                let elementTag = element.tagName.toLowerCase(); //element tagName

                if (this[elementTag])         //if this property exists
                    this[elementTag].push(element); //push element into it
                else
                    this[elementTag] = [element]; //create array and store elements inside 

                for (var i = 0; i < element.children.length; i++) {  //recursive call for each element
                    element.depth = depth;
                    this._getPageElements(element.children[i], depth + 1);
                }
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
            if (this.elementsSortedByDepth[depth])
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

            Object.keys(this).forEach(function (key) {
                if (key != "elementsSortedByNum")
                    this.elementsSortedByNum.push({ numOfElements: this[key].length, tagName: key });
            }.bind(this));

            this.elementsSortedByNum.sort(function (a, b) { return a.numOfElements - b.numOfElements });
            return this;
        }

        /**
         * Sets CurrentLevelElements with the given elements
         * 
         * @param {Array<HTMLElement>} elements 
         */
        _setCurrentLevelElements(elements) {
            let _this = this;
            this.currentLevelElements = [];

            elements.forEach(function (elem) {
                let coords = Dom.utilities.getAbsolutePageCoordinates(elem);
                _this.currentLevelElements.push(
                    {
                        element: elem,
                        x: coords.left,
                        y: coords.top,
                        rightX: coords.width + coords.left,
                        bottomY: coords.height + coords.top,
                        width: coords.width,
                        height: coords.height
                    });
            })
        }


        /**
         * Sets CurrentLevelElements with the given elements
         * 
         * @param {Array<HTMLElement>} elements 
         */
        _setCurrentLevelElements(elements) {
            let _this = this;
            this.currentLevelElements = [];

            elements.forEach(function (elem) {
                let coords = Dom.utilities.getAbsolutePageCoordinates(elem);

                elem.absoluteX = coords.left;
                elem.absoluteY = coords.top;
                elem.absoluteRight = coords.width + coords.left;
                elem.absoluteBottom = coords.height + coords.top;

                _this.currentLevelElements.push(elem);
            });
        }

        _recalcCurrentLevelElementsPosition() {
            this.currentLevelElements.forEach(function (elem) {

                let coords = Dom.utilities.getAbsolutePageCoordinates(elem);
                elem.absoluteX = coords.left;
                elem.absoluteY = coords.top;
                elem.absoluteRight = coords.width + coords.left;
                elem.absoluteBottom = coords.height + coords.top;
            });
        }


        /**
         * 
         * @param {Array<Object>} array Array of objects
         */
        _setPointerEvents(array) {
            array.forEach(function (element) {
                element.style.pointerEvents = 'auto';
            })
        }

        /**
         * 
         * @param {Array<HTMLElement>} elements 
         */
        nextLevel(elements) {
            this._setCurrentLevelElements(elements);
            this._setPointerEvents(this.currentLevelElements);
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

        getElementsWithMostDepth() {
            return this.elementsSortedByDepth.pop();
        }

        smoothScrollTo(element) {
            element.scrollIntoView({ behavior: "smooth" });
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
                right: box.right + pageXOffset,
                width: box.width,
                height: box.height
            };
        },

        getDistanceBetween2Points: function (x1, y1, x2, y2) {
            let a = x2 - x1;
            let b = y2 - y1;

            return Math.sqrt(a * a + b * b);
        },

        getCenterOfRect: function (rect) {
            return {
                x: (rect.offsetWidth - parseInt(rect.style.left)) / 2,
                y: (rect.offsetHeight - parseInt(rect.style.top)) / 2
            };
        }
    }




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
        snake.style.left = '20px'; //start position
        snake.style.top = '550px';
        snake.style.width = '30px';
        snake.style.height = '30px'
        snake.style.background = 'black';
        snake.style.position = 'absolute';
        snake.style.zIndex = '10000000000000';
        document.getElementById('body').appendChild(snake);

        window.snakeHead = document.getElementById('snake');
        snakeHead.leftAbs = parseInt(snakeHead.style.left);
        snakeHead.topAbs = parseInt(snakeHead.style.top);

        snakeHead.rightAbs = function () { return snakeHead.absLeft + snakeHead.offsetWidth; };
        snakeHead.bottomAbs = function () { return snakeHead.absTop + snakeHead.offsetHeight; };
    }

    function createUserElements() {
        let divElement = document.createElement('div');
        divElement.style.width = 'fit-content';
        divElement.style.height = 'fit-content';
        divElement.style.position = 'fixed';
        divElement.style.right = '0px';
        divElement.style.top = '90px';
        divElement.style.zIndex = '100';
        divElement.setAttribute('id', 'uidiv');
        document.body.appendChild(divElement);
    }
    // Game Heading and Gameplay Instructions
    function createUserInstructions() {
        let paragraph = document.createElement('p');
        paragraph.style.width = '180px';
        paragraph.style.height = 'fit-content';
        paragraph.style.zIndex = '2';
        paragraph.style.position = 'relative';
        paragraph.style.color = 'darkcyan';
        paragraph.style.fontFamily = 'auto';
        paragraph.style.fontSize = 'large';
        paragraph.style.fontWeight = 'bold';
        paragraph.setAttribute('id', 'p1');
        document.getElementById('uidiv').appendChild(paragraph);
        paragraph.innerText = 'Use the arrow keys to move.' + '\nTo win the game, eat all the webpage elements';
    }

    function createGameInfo() {
        let paragraph2 = document.createElement('p');
        paragraph2.style.width = 'fit-content';
        paragraph2.style.height = 'fit-content';
        paragraph2.style.zIndex = '2';
        paragraph2.style.position = 'relative';
        paragraph2.style.color = 'darkcyan';
        paragraph2.style.fontFamily = 'Comic Sans MS';
        paragraph2.style.fontSize = 'large';
        paragraph2.style.fontWeight = 'bold';
        paragraph2.style.textDecoration = 'underline';
        paragraph2.setAttribute('id', 'p2');
        document.getElementById('uidiv').appendChild(paragraph2);
        paragraph2.innerText = 'Current Level: ' + level + '\nObjective: ' //Add the elements to be eaten according to the level
        + '\nEaten tags:';

        let paragraph3 = document.createElement('p');
        paragraph3.style.width = 'fit-content';
        paragraph3.style.height = 'fit-content';
        paragraph3.style.zIndex = '2';
        paragraph3.style.position = 'relative';
        paragraph3.style.color = 'darkcyan';
        paragraph3.style.fontFamily = 'auto';
        paragraph3.style.fontSize = 'large';
        paragraph3.style.fontWeight = 'bold';
        paragraph3.setAttribute('id', 'p3');
        document.getElementById('uidiv').appendChild(paragraph3);

    }

    function eatenElement(tagName) {
        if (!eaten[tagName]) {
            eaten[tagName] = 0;
        }
        eaten[tagName]++;
        elementEaten();
    }

    function elementEaten() {
        let array = [];
          Object.keys(eaten).forEach(function(tag) {
                array.push('<' + tag + '>: ' + eaten[tag]);
            });
            
            document.getElementById('p3').innerText = array.join('\n');
    }


    // EVENT LISTENERS
    document.addEventListener('keydown', changeDirection);
    document.addEventListener('keyup', decreaseSpeed);
    window.visualViewport.onresize = function () {
        bodyWidth = htmlPage.scrollWidth;
        bodyHeight = htmlPage.scrollHeight;
        virtualDom._recalcCurrentLevelElementsPosition();
    }

    function changeDirection(event) {
        if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
            speed = speedOnKeyPressed;
            direction = directions[event.keyCode];
        }
    }

    function decreaseSpeed() {
        if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
            speed = defaultSpeed;
        }
    }



    /**
     * The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint.
     * 
     * @param {Number} timestamp - argument of requestAnimationFrame that is automatically passed when the method is called. Similar to performance.now()
     */
    function moveSnake(timestamp) {

        snakeHead.scrollIntoView({ block: "center", inline: "center" }); //scroll view around the snake


        checkCollision();


        //define values so we don't have to compute them multiple times.
        //also makes code a bit easier to read.
        let left = snakeHead.leftAbs;
        let top = snakeHead.topAbs;
        let elemWidth = snakeHead.offsetWidth;
        let elemHeight = snakeHead.offsetHeight;


        if (left < 0) {                                             //exits left side
            snakeHead.leftAbs = (bodyWidth - elemWidth);
        }
        else if (top < 0) {                                         // exits top side
            snakeHead.topAbs = (bodyHeight - elemHeight);
        }
        else if (left + elemWidth > bodyWidth) {                    // exits right side
            snakeHead.leftAbs = 0;
        }
        else if (top + elemHeight > bodyHeight) {                   //exits bottom side
            snakeHead.topAbs = 0;
        }


        snakeHead[direction.item + "Abs"] += direction.sign * speed;
        snakeHead.style[direction.item] = snakeHead[direction.item + "Abs"] + 'px'; //set the new position

        window.requestAnimationFrame(moveSnake); //call the fn again
    }



    function checkCollision() {

        for (let i = 0; i < virtualDom.currentLevelElements.length; i++) {

            let elem = virtualDom.currentLevelElements[i];

            if (elem.absoluteX < snakeHead.leftAbs + snakeHead.clientWidth &&
                elem.absoluteRight > snakeHead.leftAbs &&
                elem.absoluteY < snakeHead.topAbs + snakeHead.clientHeight &&
                elem.absoluteBottom > snakeHead.topAbs) {

                elem.style.opacity = 0;                                                                                         //opacity 0

                virtualDom.currentLevelElements[i] = virtualDom.currentLevelElements[virtualDom.currentLevelElements.length - 1];
                let elementEaten = virtualDom.currentLevelElements.pop().tagName.toLowerCase();

                eatenElement(elementEaten);
            }
        }
    }
    init();
})();

