(() => {
  let elements;
  let level = 3;
  switch(level) {
    case 1:
      elements = document.getElementsByTagName('span');
      break;
    case 2:
      elements = document.getElementsByTagName('a');
      break;
    case 3:
      elements = document.getElementsByTagName('div');
      break;
    case 4:
      elements = document.getElementsByTagName('button')
      break;
    case 5:
      elements = document.getElementsByTagName('table');
      break;
    default:
      elements = document.getElementsByTagName('h1');
        console.log('bug');
      break;
  }
  // let elements = document.getElementsByTagName('h1');
  // console.log(elements[0]);

  Array.from(elements).forEach((element) => {
    element.addEventListener('mousedown', () => {
      element.setAttribute('style', 'opacity:0;')
    });
  });

  // for(let i = 0; i < elements.length; i++) {
  //   ((index) => {
  //     elements[index].addEventListener('mouseenter', () => {
  //       // console.log('hovered on ' + elements[index]);
        
  //     });
  //   })(i);
  // }
})();