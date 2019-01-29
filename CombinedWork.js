(function SnakeGame() {
    //GLOBAL VARIABLES
    let snake = null;
    let DOMElements = null;
    let level = 1;
    let currentPoints = 0;
    let pointsPerElement = 5;
    let htmlPage = document.querySelector('html');
    let bodyWidth = htmlPage.scrollWidth;
    let bodyHeight = htmlPage.scrollHeight;
    let timeStart = null;
    let timePassed = null; //later set in seconds
    let eaten = {};

    /**
     * Levels - containing different points required for a level up
     * and each level's different foods
     */
    const levels = {
        1: {
            food: ['text'],
            pointsToLevel: 600,
        },
        2: {
            food: ['b', 'big', 'i', 'small', 'tt', 'a', 'bdo', 'br', 'img', 'map', 'object', 'q', 'span', 'sub', 'sup'],
            pointsToLevel: 1200,
        },
        3: {
            food: ['abbr', 'acronym', 'cite', 'code', 'dfn', 'em', 'kbd', 'strong', 'samp', 'var', 'button', 'input', 'label', 'select', 'textarea'],
            pointsToLevel: 1600,
        },
        4: {
            food: ['noscript', 'hr', 'dl', 'h4', 'h5', 'h6'],
            pointsToLevel: 2000,
        },
        5: {
            food: ['p', 'h1', 'h2', 'h3', 'ol', 'ul', 'pre', 'address', 'blockquote'],
            pointsToLevel: 3000,
        },
        6: {
            food: ['table', 'form', 'fieldset'],
            pointsToLevel: 4000,
        },
        7: {
            food: ['div'],
            pointsToLevel: 5000,
        }
    }

    const gameConstants = {
        snakeBodySize: 20,
        sizeDimension: 'px'
    };
    let speed = gameConstants.snakeBodySize;

    const directions = {
        39: { item: 'left', sign: 1 },    //right
        68: { item: 'left', sign: 1 },    //right - D
        37: { item: 'left', sign: -1 },   //left
        65: { item: 'left', sign: -1 },   //left - A
        40: { item: 'top', sign: 1 },     //down
        83: { item: 'top', sign: 1 },     //down - S
        38: { item: 'top', sign: -1 },    //up
        87: { item: 'top', sign: -1 },    //up - W
    }
    let direction = directions['39'];




    /**
     * Called once to initialize the game
     */
    function init() {

        getTextCoordinates();

        DOMElements = new Dom();
        calcPointsForLevels();
        snake = new Snake();

        createDiv();
        createUserElements();
        createUserInstructions();
        createGameInfo();
        snake.moveSnake(); // call last
        console.log(levels);

    };





    class Snake {

        constructor() {
            this.snakeBody = [];
            this.snakeHeadDOM = this.createSnakeHead();
            this.defaultFramesPerSecond = 20;
            this.framesPerSecond = this.defaultFramesPerSecond;
            this.frameCounter = 1;
            this.snakeBodyCounter = 10;
            this.snakeMultiplier = 1.3;

            for (let i = 0; i < this.snakeBodyCounter; i += 1)
                this.addBody();
        }


        createSnakeBody() {
            let snakeItem = document.createElement('div');
            snakeItem.style.width = gameConstants.snakeBodySize + gameConstants.sizeDimension;
            snakeItem.style.height = gameConstants.snakeBodySize + gameConstants.sizeDimension;
            snakeItem.style.position = 'absolute';
            snakeItem.style.borderRadius = 100 + gameConstants.sizeDimension;
            snakeItem.style.background = 'green';
            snakeItem.style.zIndex = '999999';
            snakeItem.style.left = 0 + gameConstants.sizeDimension;
            snakeItem.style.top = 0 + gameConstants.sizeDimension;
            snakeItem.left = 0;
            snakeItem.top = 0;
            snakeItem.direction = direction;
            document.body.appendChild(snakeItem);
            return snakeItem;
        }

        createSnakeHead() {
            let snakePart = this.createSnakeBody();
            snakePart.id = 'snake';
            snakePart.style.background = 'black';
            snakePart.style.zIndex = '1000000';
            return snakePart;
        }


        calcNewCoordinates() {

            snake.snakeHeadDOM.scrollIntoView({ block: "center", inline: "center" });

            let snakeLength = this.snakeBody.length;
            for (let i = snakeLength - 1; i !== 0; i -= 1) {
                let nextSnakePart = this.snakeBody[i-1];

                this.snakeBody[i][nextSnakePart.direction.item] = nextSnakePart[nextSnakePart.direction.item];
                this.snakeBody[i].direction = nextSnakePart.direction;
            }

            this.snakeBody[0][this.snakeHeadDOM.direction.item] = this.snakeHeadDOM[this.snakeHeadDOM.direction.item];
            this.snakeBody[0].direction = this.snakeHeadDOM.direction;
            this.snakeHeadDOM[direction.item] += direction.sign * speed;
            this.snakeHeadDOM.direction = direction;

            if (this.snakeHeadDOM.left < 0) {
                this.snakeHeadDOM.left = bodyWidth - gameConstants.snakeBodySize;
            } else if (this.snakeHeadDOM.top < 0) {
                this.snakeHeadDOM.top = bodyHeight - gameConstants.snakeBodySize;
            } else if (this.snakeHeadDOM.left + gameConstants.snakeBodySize > bodyWidth) {
                this.snakeHeadDOM.left = 0;
            } else if (this.snakeHeadDOM.top + gameConstants.snakeBodySize > bodyHeight) {
                this.snakeHeadDOM.top = 0;
            }
        }

        addBody() {
            this.snakeBody.push(this.createSnakeBody());
        }

        draw() {
            for (let element of snake.snakeBody) {

                element.style.left = element.left + gameConstants.sizeDimension;
                element.style.top = element.top + gameConstants.sizeDimension;
                this.snakeHeadDOM.style[direction.item] = this.snakeHeadDOM[direction.item] + gameConstants.sizeDimension;
            }
        }


        checkCollision() {

            for (let i = 0; i < DOMElements.currentLevelElements.length; i++) { //check all elements

                let elem = DOMElements.currentLevelElements[i];

                //if collision
                if (elem.absoluteX < this.snakeHeadDOM.left + gameConstants.snakeBodySize &&
                    elem.absoluteRight > this.snakeHeadDOM.left &&
                    elem.absoluteY < this.snakeHeadDOM.top + gameConstants.snakeBodySize &&
                    elem.absoluteBottom > this.snakeHeadDOM.top) {

                    elem.style.opacity = 0; //opacity 0

                    //override the eaten element in the array with the last element and then remove the last element in array
                    DOMElements.currentLevelElements[i] = DOMElements.currentLevelElements[DOMElements.currentLevelElements.length - 1];
                    DOMElements.currentLevelElements.pop();

                    addPoints(pointsPerElement);
                    eatenElement(elem);
                }
            }
        }


        /**
         * The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation on the next repaint.
         * 
         * @param {Number} timestamp - argument of requestAnimationFrame that is automatically passed when the method is called. Similar to performance.now()
         */
        moveSnake(timestamp) {

            debugger;
            this.frameCounter += 1;
            if(!(this.frameCounter % (60/this.framesPerSecond))) {
                this.snakeBodyCounter = 0;

                snake.calcNewCoordinates();
                snake.checkCollision();
                snake.draw();
            }
            updateGameInfo(timestamp);

            window.requestAnimationFrame(this.moveSnake.bind(this));    //call the fn again
        }
    }


    class Dom {

        constructor() {
            this.elementsSortedByDepth = [];
            this.elementsSortedByNum = [];
            this.currentLevelElements = [];

            //fills the arrays elementsSortedByDepth and elementsSortedByNum
            //and sets a property onto the object for each type of tagName on the page
            this._getPageElements(document.body, 0);
            this._sortByNumElements();
            this.setLevelElements();

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
        _getPageElements(element, depth) {                                  //called for every element

            this._sortByDepth(element, depth);
            this._setElementAbsoluteCoords(element);

            if (/* element.clientHeight > 0 && element.clientWidth > 0 &&   */    //check if element is visible on the page
                element.absoluteX < bodyWidth &&
                element.absoluteRight > 0 &&
                element.absoluteY < bodyHeight &&
                element.absoluteBottom > 0) {

                let elementTag = element.tagName.toLowerCase();             //element tagName
                if (this[elementTag])                                       //if this property exists
                    this[elementTag].push(element);                         //push element into it
                else
                    this[elementTag] = [element];                           //if it does not exist, create array and store element inside 

                for (let i = 0; i < element.children.length; i++) {         //recursive call for each element
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
		 * Sorts the tagName of elements found on the page by their count
		 */
        _sortByNumElements() {

            Object.keys(this).forEach(function (key) {
                if (key != "elementsSortedByNum" && key != 'elementsSortedByDepth' && key != 'currentLevelElements')
                    this.elementsSortedByNum.push(
                        {
                            numOfElements: this[key].length,
                            tagName: key
                        }
                    );
            }.bind(this));

            this.elementsSortedByNum.sort(function (a, b) {
                return a.numOfElements - b.numOfElements
            });
            return this;
        }


        /**
         * Gets the array of elements based on the strings in the levels[level] object
         * @returns {Array<HTMLElement>} an array of html elements
         */
        _getArrayOfElements() {
            let arrayWithTagNames = levels[level].food;
            let array = [];

            for (let i = 0; i < arrayWithTagNames.length; i++) {
                if (this[arrayWithTagNames[i]]) {
                    array = array.concat(this[arrayWithTagNames[i]]);
                }
            }
            return array;
        }

        _setElementAbsoluteCoords(elem) {
            let coords = Dom.utilities.getAbsolutePageCoordinates(elem);
            elem.absoluteX = coords.left;
            elem.absoluteY = coords.top;
            elem.absoluteRight = coords.width + coords.left;
            elem.absoluteBottom = coords.height + coords.top;
        }

		/**
         * Calls _getArrayOfElements to get the tagNames of what elements it needs to get.
         * 
         * Calculates the absolute coordinates of each element and 
		 * Sets the property CurrentLevelElements to an array with the given elements
		 */
        setLevelElements() {
            let elements = this._getArrayOfElements();
            let _this = this;
            //this.currentLevelElements = []; 

            if (level === 1) {                      // if level 1 (text elements)   -- dont set a border around the letters
                elements.forEach(function (elem) {
                    _this.currentLevelElements.push(elem);
                });
            }
            else {                                          // else set border around the elements
                elements.forEach(function (elem) {
                    elem.style.border = ' 1px solid red';
                    _this.currentLevelElements.push(elem);
                });
            }

            this._recalcCurrentLevelElementsPosition();
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

        getElementsWithMostDepth() {
            return this.elementsSortedByDepth.pop();
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
	 * Function that will add points, based on eating different elements
	 * @param {Number} points
	 */
    function addPoints(points) {
        currentPoints += points;

        if (levels[level + 1]) {                                        //check if there is a next level
            if (DOMElements.currentLevelElements.length) {               //check if there are any elements left to eat
                if (currentPoints >= levels[level].pointsToLevel) {
                    nextLevel();
                }
            }
            else {                                                      //if there is nothing left to eat in currentLevelElements array
                nextLevel();
            }
        }
    }

    /**
     * used in the function addPoints()
     */
    function nextLevel() {
        level++;
        alert(`gz, you are level ${level} now!`);
        DOMElements.setLevelElements();
        if (DOMElements.currentLevelElements.length === 0) //check if there are any elements of this type on the page, if not, go to next level. Otherwise you're stuck on a level you can never eat anything.
            nextLevel();
    }


    function calcPointsForLevels() {
        levels[1].pointsToLevel = DOMElements.currentLevelElements.length * pointsPerElement /2;   //50% of chars
        for(let i=2; i < Object.keys(levels).length+1; i+=1) {
            levels[i].pointsToLevel = levels[i-1].pointsToLevel + 2000;
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
        div.style.background = 'rgba(255, 255, 255, .15)'; //set opacity 
        div.style.color = 'white';
        div.style.position = 'fixed';
        div.style.top = '0';
        div.style.left = '0';
        div.setAttribute('id', 'Div1');
        div.style.zIndex = '10000000000000';
        document.body.appendChild(div);
    }


    function createUserElements() {
        let divElement = document.createElement('div');
        divElement.style.width = 'fit-content';
        divElement.style.height = 'fit-content';
        divElement.style.position = 'fixed';
        divElement.style.right = '0px';
        divElement.style.top = '90px';
        divElement.style.zIndex = '100';
        divElement.style.backgroundColor = 'black';
        divElement.style.padding = '10px';
        divElement.style.marginRight = '10px';
        divElement.style.opacity = '0.7';
        divElement.setAttribute('id', 'uidiv');
        document.body.appendChild(divElement);
    }
    // Game Heading and Gameplay Instructions
    function createUserInstructions() {
        let paragraph = document.createElement('p');
        paragraph.style.maxWidth = 200 + 'px';
        paragraph.style.height = 'fit-content';
        paragraph.style.zIndex = '2';
        paragraph.style.position = 'relative';
        paragraph.style.color = 'white';
        paragraph.style.fontFamily = 'auto';
        paragraph.style.fontSize = 'large';
        paragraph.style.fontWeight = 'bold';
        paragraph.style.textDecoration = 'underline';
        paragraph.style.marginBottom = '5px';
        paragraph.setAttribute('id', 'p1');
        document.getElementById('uidiv').appendChild(paragraph);
        paragraph.innerText = 'Use the arrow keys to move.' + '\nTo win the game eat all the webpage elements';
    }

    function createGameInfo() {
        let paragraph2 = document.createElement('p');
        paragraph2.style.width = 'fit-content';
        paragraph2.style.height = 'fit-content';
        paragraph2.style.zIndex = '2';
        paragraph2.style.position = 'relative';
        paragraph2.style.color = 'white';
        paragraph2.style.fontFamily = 'Comic Sans MS';
        paragraph2.style.fontSize = 'large';
        paragraph2.style.fontWeight = 'bold';
        paragraph2.style.marginBottom = '5px';
        paragraph2.setAttribute('id', 'p2');
        document.getElementById('uidiv').appendChild(paragraph2);
        paragraph2.innerText = 'Current Level: ' + level + '\nPoints: ' + currentPoints +
            '\nElements Left: ' + DOMElements.currentLevelElements.length + '\nTime: 0:00' + '\nEaten tags:';

        let paragraph3 = document.createElement('p');
        paragraph3.style.width = 'fit-content';
        paragraph3.style.height = 'fit-content';
        paragraph3.style.zIndex = '2';
        paragraph3.style.position = 'relative';
        paragraph3.style.color = 'white';
        paragraph3.style.fontFamily = 'auto';
        paragraph3.style.fontSize = 'large';
        paragraph3.setAttribute('id', 'p3');
        document.getElementById('uidiv').appendChild(paragraph3);
    }

    function updateGameInfo(timestamp) {

        if (!timeStart)
            timeStart = timestamp;

        let timeElapsed = timestamp - timeStart;                //in milliseconds
        timePassed = parseInt(timeElapsed / 1000);              //in seconds - GLOBAL VAR

        let timeString = null;
        if (timePassed % 60 < 10)
            timeString = parseInt(timePassed / 60) + ':0' + timePassed % 60;
        else
            timeString = parseInt(timePassed / 60) + ':' + timePassed % 60;

        if (timeElapsed % 1000 < 16.6) { //true ~ 1 time per second

            document.getElementById('p2').innerText = 'Current Level: ' + level + '\nPoints: ' + currentPoints +
                '\nElements Left: ' + DOMElements.currentLevelElements.length + '\nTime: ' + timeString + '\nEaten tags:';
        }
    }


    /**
     * 
     * @param {HTMLElement} element 
     */
    function eatenElement(element) {
        let tagName = element.tagName.toLowerCase();
        let array = [];

        if (!eaten[tagName]) {
            eaten[tagName] = 0;
        }
        eaten[tagName]++;

        Object.keys(eaten).forEach(function (tag) {
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
        DOMElements._recalcCurrentLevelElementsPosition();
    }

    function changeDirection(event) {
        if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
            snake.framesPerSecond = snake.defaultFramesPerSecond * snake.speedMultiplier;
            direction = directions[event.keyCode];
        }
    }

    function decreaseSpeed() {
        if (Object.keys(directions).indexOf(String(event.keyCode)) != -1) {
            snake.framesPerSecond = snake.defaultFramesPerSecond;
        }
    }

    function getTextCoordinates() {

        let allTags = document.body.querySelectorAll('*'),
            allValidTags = [],
            tagLen,
            tagSymbolsArr,
            tagSymbolsString,
            tagText;

        for (let tag of allTags) {
            if (tag.innerText !== '' && tag.tagName !== 'SCRIPT' && tag.tagName !== 'SVG' && tag.tagName !== 'STYLE') {
                allValidTags.push(tag);
            }
        }

        for (let tag of allValidTags) {

            if (tag.innerText) {
                tagText = tag.innerText;
                tagLen = tagText.length;

                //In case that it's tag that contains only text
                if (tag.childNodes.length == 1 && tag.childNodes[0].nodeType === 3) {

                    //make an array from the tag
                    tagSymbolsArr = tagText.split('');

                    //put every symbol in <text></text>
                    for (let i = 0; i < tagLen; i += 1) {

                        let textTag = document.createElement('text');
                        textTag.innerText = tagSymbolsArr[i];
                        tagSymbolsArr[i] = textTag.outerHTML;

                    }

                    //transform tagSymbolsArr into string
                    tagSymbolsString = tagSymbolsArr.join('');

                    //change HTML tag content with newly created content
                    tag.innerHTML = tagSymbolsString;

                } else {
                    //check if the tagText is not empty
                    if (!/^\s+$/.test(tagText)) {

                        let parentTag = tag.childNodes,
                            parentTagLength = parentTag.length,
                            nextSib,
                            prevSib,
                            currentEl,
                            currElLength,
                            currentElArr = [],
                            currentElString = '';

                        //console.log(parentTag);

                        for (let i = 0; i < parentTagLength; i += 1) {

                            //check if typeof childnode is text
                            if (parentTag[i].nodeType === 3) {

                                currentEl = parentTag[i].nodeValue.trim();
                                currElLength = currentEl.length;

                                for (let j = 0; j < currElLength; j += 1) {

                                    let textTag = document.createElement('text');
                                    textTag.innerHTML = currentEl[j];
                                    currentElArr.push(textTag.outerHTML);

                                }

                                currentElString = currentElArr.join('');
                                currentElArr = [];

                                //push all changed symbols in onе texttext tag
                                let textTextTag = document.createElement('textText');
                                textTextTag.innerHTML = currentElString;

                                if (parentTag[i] === parentTag[i].parentNode.lastChild) {
                                    prevSib = parentTag[i].previousSibling;
                                    prevSib.parentNode.removeChild(prevSib.parentNode.lastChild);
                                    prevSib.parentNode.appendChild(textTextTag);
                                } else {
                                    nextSib = parentTag[i].nextSibling;
                                    parentTag[i].parentNode.removeChild(nextSib.previousSibling);
                                    nextSib.parentNode.insertBefore(textTextTag, nextSib);
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    init();
})();