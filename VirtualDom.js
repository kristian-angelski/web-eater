class Dom {

    constructor() {
        this.elementsSortedByDepth = [];
        this.elementsSortedByNum = [];
        this.currentLevelElements = [];

        //fills the arrays elementsSortedByDepth and elementsSortedByNum
        //and sets a property onto Dom for each type of tagName on the page
        this._getPageElements(document.body, 0);
        this._sortByNumElements();
        this.nextLevel( this.getElementsWithMostDepth() );  //the array of HTML elements to put into the next level

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

        let elementCoords = element.getBoundingClientRect(); //element position
        element.style.pointerEvents = 'none';   //set every elements pointer events to none
        this._sortByDepth(element, depth);

        if (elementCoords.height > 0 || elementCoords.width > 0) { //check if element has width or height

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
     * Sets CurrentLevelElements with the given elements
     * 
     * @param {Array<HTMLElement>} elements 
     */
    _setCurrentLevelElements(elements) {
        let _this = this;

        elements.forEach( function(elem) {
            let coords = Dom.utilities.getAbsolutePageCoordinates(elem);
            _this.currentLevelElements.push(
                {
                    element: elem, 
                    x: coords.left , 
                    y: coords.top, 
                    rightX: coords.width + coords.left , 
                    bottomY: coords.height + coords.top
                });
        })
    }


    /**
     * 
     * @param {Array<Object>} array Array of objects
     */
    _setPointerEvents(array){
        array.forEach( function(object) {
            object.element.style.pointerEvents = 'auto';
        })
    }


    /**
     * 
     * @param {Array<HTMLElement>} elements 
     */
    nextLevel(elements) {
        this._setCurrentLevelElements( elements);
        this._setPointerEvents(this.currentLevelElements);
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

    smoothScrollTo(element) {
        element.scrollIntoView({behavior: "smooth"});
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

    getDistanceBetween2Points: function(x1, y1, x2, y2) {
        let a = x2-x1;
        let b = y2-y1;

        return Math.sqrt( a*a + b*b );
    },

    getCenterOfRect: function(rect) {
        return  {
                    x: (rect.offsetWidth - parseInt(rect.style.left))/2,
                    y: (rect.offsetHeight - parseInt(rect.style.top))/2 
                };
    }
}