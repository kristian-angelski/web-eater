function getTextCoordinates() {

    let allTags = document.body.querySelectorAll('*');
    let allContainingText = [];

    for (let tag of allTags) {
        if (tag.innerText !== '' && tag.tagName !== 'SCRIPT' && tag.tagName !== 'SVG' && tag.tagName !== 'STYLE') {
            allContainingText.push(tag);
        }

    }

    let allSymbols = allContainingText,
        paragraph,
        allSymbolsLocations = [],
        italicsInP,
        elementLocation,
        pLen,
        pArr,
        pString,
        paragraphText;

    for (let p of allSymbols) {

            if (p.childNodes.length == 1) {

                paragraph = p;
                paragraphText = paragraph.innerText;

                pLen = paragraphText.length;
                //make an array from the paragraph
                pArr = paragraphText.split('');

                //put every symbol in <text></text>
                for (let i = 0; i < pLen; i += 1) {

                    let textTag = document.createElement('text');
                    //iTag.style.fontStyle = 'normal';
                    textTag.innerText = pArr[i];
                    pArr[i] = textTag.outerHTML;

                }

                //transform pArr to string
                pString = pArr.join('');
                //change HTML paragraph content with newly created content
                paragraph.innerHTML = pString;

                //push <i> locations in array

                
            } else {
                //check for string with one or more spaces
                if (!/^\s+$/.test(paragraphText)) {
                    let bigTag = p.childNodes,
                        bigTagLength = bigTag.length,
                        valueToChange;
                    let nextSib;
                    let prevSib;
                    let currentEl,
                    currElLength,
                    currentElArr = [],
                    currentElString = '';
            
                    //console.log(bigTag[0].nodeValue, 'dhfgrygygyg');
                    for (let i = 0; i < bigTagLength; i += 1) {
                        
                        //check if typeof childnode is text
                        if (bigTag[i].nodeType === 3) {

                            currentEl = bigTag[i].nodeValue;
                            
                            currElLength = currentEl.length;
              

                            for (let i = 0; i < currElLength; i += 1) {

                                let textTag = document.createElement('text');
                                textTag.innerHTML = currentEl[i];
                                currentElArr.push(textTag.outerHTML);

                            }
                            
                            currentElString = currentElArr.join('');
                            valueToChange = currentElString;

                            //push all changed symbols in on texttext tag
                            let textTextTag = document.createElement('textText');
                            textTextTag.innerHTML = valueToChange;

                            if (bigTag[i] === bigTag[i].parentNode.lastChild) {

                                prevSib = bigTag[i].previousSibling;
                                prevSib.parentNode.removeChild(prevSib.parentNode.lastChild);
                                prevSib.parentNode.appendChild(textTextTag);
                           
                            } else {
                                nextSib = bigTag[i].nextSibling;
                                nextSib.parentNode.insertBefore(textTextTag, nextSib);
                                bigTag[i].parentNode.removeChild(nextSib.previousSibling.previousSibling);
                            }
                        }
                    }
                }
            }        
    }
    italicsInP = document.body.querySelectorAll('text');

    for (let i of italicsInP) {
        //get <i> coordinates and push them into allSymbolsLocations array
        elementLocation = i.getBoundingClientRect();
        allSymbolsLocations.push({ element: i, x: elementLocation.x, y: elementLocation.y });
    }
   
    console.log(allSymbolsLocations);

    // get snake's head x, y locations and make symbol invisible
        // document.elementFromPoint(x, y).style.opacity = '0';


        //console.log(document.elementFromPoint(allSymbolsLocations[10].x, allSymbolsLocations[10].y));
        //console.log(allSymbolsLocations.find(el => el.x === 8 && el.y === 16));

        //return allSymbolsLocations;
}
getTextCoordinates();