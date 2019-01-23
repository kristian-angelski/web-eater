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